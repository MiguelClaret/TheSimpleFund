#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, String, Vec, symbol_short, vec
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    FundTokenAddress,
    Receivable(String), // ID -> Receivable
    ReceivableCount,
    TotalPaid,
}

#[derive(Clone)]
#[contracttype]
pub struct Receivable {
    pub id: String,
    pub face_value: i128,
    pub due_date: u64,
    pub debtor_address: Address,
    pub status: u32, // 0 = pending, 1 = paid, 2 = distributed
    pub paid_amount: i128,
    pub paid_date: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct HolderDistribution {
    pub address: Address,
    pub balance: i128,
    pub amount: i128,
}

#[contract]
pub struct ReceivableVault;

#[contractimpl]
impl ReceivableVault {
    /// Initialize the vault contract
    pub fn initialize(env: Env, admin: Address, fund_token_address: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::FundTokenAddress, &fund_token_address);
        env.storage().instance().set(&DataKey::ReceivableCount, &0u32);
        env.storage().instance().set(&DataKey::TotalPaid, &0i128);
    }

    /// Register a new receivable (admin only)
    pub fn register_receivable(
        env: Env,
        id: String,
        face_value: i128,
        due_date: u64,
        debtor_address: Address,
    ) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Receivable(id.clone())) {
            panic!("Receivable already exists");
        }

        let receivable = Receivable {
            id: id.clone(),
            face_value,
            due_date,
            debtor_address,
            status: 0, // pending
            paid_amount: 0,
            paid_date: 0,
        };

        env.storage().persistent().set(&DataKey::Receivable(id.clone()), &receivable);

        let count: u32 = env.storage().instance().get(&DataKey::ReceivableCount).unwrap_or(0);
        env.storage().instance().set(&DataKey::ReceivableCount, &(count + 1));

        // Emit event
        env.events().publish(
            (symbol_short!("rcv_reg"), id),
            face_value
        );
    }

    /// Mark receivable as paid (admin only)
    pub fn mark_paid(env: Env, id: String, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut receivable: Receivable = env.storage()
            .persistent()
            .get(&DataKey::Receivable(id.clone()))
            .unwrap_or_else(|| panic!("Receivable not found"));

        if receivable.status != 0 {
            panic!("Receivable already processed");
        }

        receivable.status = 1; // paid
        receivable.paid_amount = amount;
        receivable.paid_date = env.ledger().timestamp();

        env.storage().persistent().set(&DataKey::Receivable(id.clone()), &receivable);

        let total_paid: i128 = env.storage().instance().get(&DataKey::TotalPaid).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalPaid, &(total_paid + amount));

        // Emit event
        env.events().publish(
            (symbol_short!("rcv_paid"), id),
            amount
        );
    }

    /// Distribute payment to token holders (admin only)
    /// holders_list: list of [address, balance] for pro-rata calculation
    pub fn distribute(env: Env, receivable_id: String, holders_list: Vec<HolderDistribution>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut receivable: Receivable = env.storage()
            .persistent()
            .get(&DataKey::Receivable(receivable_id.clone()))
            .unwrap_or_else(|| panic!("Receivable not found"));

        if receivable.status != 1 {
            panic!("Receivable not paid yet");
        }

        // Calculate total shares
        let mut total_shares = 0i128;
        for holder in holders_list.iter() {
            total_shares += holder.balance;
        }

        if total_shares == 0 {
            panic!("No token holders found");
        }

        // Distribute payments (in a real scenario, this would transfer tokens/native currency)
        let paid_amount = receivable.paid_amount;

        for holder in holders_list.iter() {
            let distribution_amount = (holder.balance * paid_amount) / total_shares;
            
            if distribution_amount > 0 {
                // In a real implementation, you would transfer tokens here
                // For the MVP, we just emit events for tracking
                
                env.events().publish(
                    (symbol_short!("dist"), holder.address.clone()),
                    distribution_amount
                );
            }
        }

        receivable.status = 2; // distributed
        env.storage().persistent().set(&DataKey::Receivable(receivable_id.clone()), &receivable);

        // Emit summary event
        env.events().publish(
            (symbol_short!("dist_sum"), receivable_id),
            paid_amount
        );
    }

    /// Get receivable by ID
    pub fn get_receivable(env: Env, id: String) -> Receivable {
        env.storage()
            .persistent()
            .get(&DataKey::Receivable(id))
            .unwrap_or_else(|| panic!("Receivable not found"))
    }

    /// Get all receivables (simplified for MVP)
    pub fn get_receivables_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::ReceivableCount).unwrap_or(0)
    }

    /// Get total amount paid across all receivables
    pub fn get_total_paid(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalPaid).unwrap_or(0)
    }

    /// Get fund token address
    pub fn get_fund_token_address(env: Env) -> Address {
        env.storage().instance().get(&DataKey::FundTokenAddress).unwrap()
    }

    /// Get admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
}

mod test;
