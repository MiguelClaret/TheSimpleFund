#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, symbol_short};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Name,
    Symbol,
    Decimals,
    TotalSupply,
    Balance(Address),
    Whitelist(Address),
    Paused,
}

pub const DECIMAL: u32 = 7;

#[contract]
pub struct FundToken;

#[contractimpl]
impl FundToken {
    /// Initialize the token contract
    pub fn initialize(
        env: Env,
        admin: Address,
        name: String,
        symbol: String,
        max_supply: i128,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::Decimals, &DECIMAL);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
        env.storage().instance().set(&DataKey::Paused, &false);
        
        // Set max supply as a custom property for the fund
        env.storage().instance().set(&symbol_short!("MaxSupply"), &max_supply);
    }

    /// Add address to whitelist (admin only)
    pub fn whitelist_add(env: Env, address: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Whitelist(address.clone()), &true);
        
        // Emit event
        env.events().publish(
            (symbol_short!("whitelist"), symbol_short!("add")),
            address
        );
    }

    /// Remove address from whitelist (admin only)
    pub fn whitelist_remove(env: Env, address: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        env.storage().persistent().remove(&DataKey::Whitelist(address.clone()));
        
        // Emit event
        env.events().publish(
            (symbol_short!("whitelist"), symbol_short!("remove")),
            address
        );
    }

    /// Check if address is whitelisted
    pub fn is_whitelisted(env: Env, address: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Whitelist(address))
            .unwrap_or(false)
    }

    /// Mint tokens (admin only)
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let paused: bool = env.storage().instance().get(&DataKey::Paused).unwrap_or(false);
        if paused {
            panic!("Contract is paused");
        }

        // Check if recipient is whitelisted
        if !Self::is_whitelisted(env.clone(), to.clone()) {
            panic!("Recipient not whitelisted");
        }

        let current_supply: i128 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        let max_supply: i128 = env.storage().instance().get(&symbol_short!("MaxSupply")).unwrap();
        
        if current_supply + amount > max_supply {
            panic!("Would exceed max supply");
        }

        let current_balance = Self::balance(env.clone(), to.clone());
        let new_balance = current_balance + amount;
        let new_supply = current_supply + amount;

        env.storage().instance().set(&DataKey::TotalSupply, &new_supply);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &new_balance);

        // Emit transfer event (from zero address)
        env.events().publish(
            (symbol_short!("transfer"), to.clone()),
            amount
        );
    }

    /// Transfer tokens (only to whitelisted addresses)
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> bool {
        from.require_auth();

        let paused: bool = env.storage().instance().get(&DataKey::Paused).unwrap_or(false);
        if paused {
            panic!("Contract is paused");
        }

        // Check if recipient is whitelisted
        if !Self::is_whitelisted(env.clone(), to.clone()) {
            panic!("Recipient not whitelisted");
        }

        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        let to_balance = Self::balance(env.clone(), to.clone());
        
        env.storage().persistent().set(&DataKey::Balance(from.clone()), &(from_balance - amount));
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &(to_balance + amount));

        // Emit transfer event
        env.events().publish(
            (symbol_short!("transfer"), from, to),
            amount
        );

        true
    }

    /// Get balance of an address
    pub fn balance(env: Env, address: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(address))
            .unwrap_or(0)
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
    }

    /// Get token name
    pub fn name(env: Env) -> String {
        env.storage().instance().get(&DataKey::Name).unwrap()
    }

    /// Get token symbol
    pub fn symbol(env: Env) -> String {
        env.storage().instance().get(&DataKey::Symbol).unwrap()
    }

    /// Get decimals
    pub fn decimals(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::Decimals).unwrap()
    }

    /// Get admin address
    pub fn admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }

    /// Pause/unpause contract (admin only)
    pub fn set_pause(env: Env, paused: bool) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        env.storage().instance().set(&DataKey::Paused, &paused);
        
        env.events().publish(
            (symbol_short!("pause"),),
            paused
        );
    }

    /// Check if contract is paused
    pub fn is_paused(env: Env) -> bool {
        env.storage().instance().get(&DataKey::Paused).unwrap_or(false)
    }

    /// Get max supply
    pub fn max_supply(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("MaxSupply")).unwrap()
    }
}

mod test;
