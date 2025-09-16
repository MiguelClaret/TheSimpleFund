#![no_std]
use soroban_sdk::{contract, contractimpl, contracterror, contracttype, Address, Env, String, symbol_short};

const DECIMALS: u32 = 7;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Name,
    Symbol,
    Decimals,
    TotalSupply,
    MaxSupply,
    Balance(Address),
    Whitelist(Address),
    Paused,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum TokenError {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    Paused = 3,
    NotWhitelisted = 4,
    InsufficientBalance = 5,
    SupplyOverflow = 6,
    InvalidAmount = 7,
}

fn ensure_positive(amount: i128) -> Result<(), TokenError> {
    if amount <= 0 { return Err(TokenError::InvalidAmount); }
    Ok(())
}
fn add(a: i128, b: i128, e: TokenError) -> Result<i128, TokenError> {
    a.checked_add(b).ok_or(e)
}
fn sub(a: i128, b: i128, e: TokenError) -> Result<i128, TokenError> {
    a.checked_sub(b).ok_or(e)
}

#[contract]
pub struct FundToken;

#[contractimpl]
impl FundToken {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String, max_supply: i128) -> Result<(), TokenError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(TokenError::AlreadyInitialized);
        }
        admin.require_auth();
        if name.len() == 0 || symbol.len() == 0 || max_supply <= 0 {
            return Err(TokenError::InvalidAmount);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::Decimals, &DECIMALS);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
        env.storage().instance().set(&DataKey::MaxSupply, &max_supply);
        env.storage().instance().set(&DataKey::Paused, &false);
        Ok(())
    }

    // --- Whitelist (KYC/AML) ---
    pub fn whitelist_add(env: Env, address: Address) -> Result<(), TokenError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Whitelist(address.clone()), &true);
        env.events().publish((symbol_short!("whitelist_add"),), address);
        Ok(())
    }
    pub fn whitelist_remove(env: Env, address: Address) -> Result<(), TokenError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().persistent().remove(&DataKey::Whitelist(address.clone()));
        env.events().publish((symbol_short!("whitelist_remove"),), address);
        Ok(())
    }
    pub fn is_whitelisted(env: Env, address: Address) -> bool {
        env.storage().persistent().get(&DataKey::Whitelist(address)).unwrap_or(false)
    }

    // --- Mint / Transfer ---
    pub fn mint(env: Env, to: Address, amount: i128) -> Result<(), TokenError> {
        ensure_positive(amount)?;
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        if env.storage().instance().get::<bool>(&DataKey::Paused).unwrap_or(false) {
            return Err(TokenError::Paused);
        }
        if !Self::is_whitelisted(env.clone(), to.clone()) {
            return Err(TokenError::NotWhitelisted);
        }

        let cur_supply: i128 = env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0);
        let max_supply: i128 = env.storage().instance().get(&DataKey::MaxSupply).unwrap();
        let new_supply = add(cur_supply, amount, TokenError::SupplyOverflow)?;
        if new_supply > max_supply { return Err(TokenError::SupplyOverflow); }

        let bal = Self::balance(env.clone(), to.clone());
        let new_bal = add(bal, amount, TokenError::SupplyOverflow)?;

        env.storage().instance().set(&DataKey::TotalSupply, &new_supply);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &new_bal);
        env.events().publish((symbol_short!("mint"), to), amount);
        Ok(())
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> Result<bool, TokenError> {
        ensure_positive(amount)?;
        from.require_auth();
        if env.storage().instance().get::<bool>(&DataKey::Paused).unwrap_or(false) {
            return Err(TokenError::Paused);
        }
        if !Self::is_whitelisted(env.clone(), to.clone()) {
            return Err(TokenError::NotWhitelisted);
        }

        let from_bal = Self::balance(env.clone(), from.clone());
        let to_bal = Self::balance(env.clone(), to.clone());
        let from_new = sub(from_bal, amount, TokenError::InsufficientBalance)?;
        let to_new   = add(to_bal, amount, TokenError::SupplyOverflow)?;

        env.storage().persistent().set(&DataKey::Balance(from.clone()), &from_new);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &to_new);
        env.events().publish((symbol_short!("transfer"), from, to), amount);
        Ok(true)
    }

    // --- Views / Admin ---
    pub fn set_pause(env: Env, paused: bool) -> Result<(), TokenError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &paused);
        env.events().publish((symbol_short!("pause"),), paused);
        Ok(())
    }

    pub fn balance(env: Env, addr: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(addr)).unwrap_or(0)
    }
    pub fn total_supply(env: Env) -> i128 { env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0) }
    pub fn max_supply(env: Env) -> i128 { env.storage().instance().get(&DataKey::MaxSupply).unwrap() }
    pub fn decimals(env: Env) -> u32 { env.storage().instance().get(&DataKey::Decimals).unwrap() }
    pub fn name(env: Env) -> String { env.storage().instance().get(&DataKey::Name).unwrap() }
    pub fn symbol(env: Env) -> String { env.storage().instance().get(&DataKey::Symbol).unwrap() }
    pub fn admin(env: Env) -> Address { env.storage().instance().get(&DataKey::Admin).unwrap() }
    pub fn is_paused(env: Env) -> bool { env.storage().instance().get(&DataKey::Paused).unwrap_or(false) }
}
