#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    Address, Env, String, Vec, vec, symbol_short,
};

#[derive(Clone)]
#[contracttype]
pub enum Status { Pending = 0, Approved = 1, Rejected = 2 }

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    FundTokenAddress,           // endereço do contrato de cotas deste fundo
    Consultants(Address),       // whitelist de consultores
    Cedente(String),            // id -> EntityRecord
    Sacado(String),
    Fund(String),               // fund_id -> FundRecord
    Receivable(String),         // id -> Receivable
    ReceivableCount,
    TotalPaid,
}

#[derive(Clone)]
#[contracttype]
pub struct EntityRecord {
    pub id: String,             // CNPJ/CPF ou identificador
    pub name: String,
    pub created_by: Address,    // Consultor que propôs
    pub status: Status,
}

#[derive(Clone)]
#[contracttype]
pub struct FundRecord {
    pub id: String,             // ex. "FUND-AGRO-001"
    pub name: String,
    pub created_by: Address,    // Consultor que propôs
    pub status: Status,
    pub token: Address,         // endereço do FundToken (pode ficar zerado até aprovação)
}

#[derive(Clone)]
#[contracttype]
pub enum ReceivableStatus { Pending = 0, Paid = 1, Distributed = 2 }

#[derive(Clone)]
#[contracttype]
pub struct Receivable {
    pub id: String,
    pub fund_id: String,
    pub cedente_id: String,
    pub sacado_id: String,
    pub face_value: i128,
    pub due_date: u64,
    pub debtor_address: Address, // opcional: sacado on-chain
    pub status: ReceivableStatus,
    pub paid_amount: i128,
    pub paid_date: u64,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum VaultError {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    NotConsultant = 3,
    DuplicateId = 4,
    NotFound = 5,
    Invalid = 6,
    BadStatus = 7,
    Math = 8,
}

fn add(a: i128, b: i128) -> Result<i128, VaultError> { a.checked_add(b).ok_or(VaultError::Math) }
fn sub(a: i128, b: i128) -> Result<i128, VaultError> { a.checked_sub(b).ok_or(VaultError::Math) }

#[contract]
pub struct ReceivableVault;

#[contractimpl]
impl ReceivableVault {
    // -------- Init / Roles --------
    pub fn initialize(env: Env, admin: Address, fund_token_address: Address) -> Result<(), VaultError> {
        if env.storage().instance().has(&DataKey::Admin) { return Err(VaultError::AlreadyInitialized); }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::FundTokenAddress, &fund_token_address);
        env.storage().instance().set(&DataKey::ReceivableCount, &0u32);
        env.storage().instance().set(&DataKey::TotalPaid, &0i128);
        Ok(())
    }

    pub fn consultant_add(env: Env, addr: Address) -> Result<(), VaultError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Consultants(addr.clone()), &true);
        env.events().publish((symbol_short!("consultant_add"),), addr);
        Ok(())
    }
    pub fn consultant_remove(env: Env, addr: Address) -> Result<(), VaultError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().persistent().remove(&DataKey::Consultants(addr.clone()));
        env.events().publish((symbol_short!("consultant_remove"),), addr);
        Ok(())
    }
    fn is_consultant(env: &Env, addr: &Address) -> bool {
        env.storage().persistent().get(&DataKey::Consultants(addr.clone())).unwrap_or(false)
    }

    // -------- Cadastros propostos pelo Consultor --------
    pub fn submit_cedente(env: Env, id: String, name: String) -> Result<(), VaultError> {
        let who = env.invoker();
        if !Self::is_consultant(&env, &who) { return Err(VaultError::NotConsultant); }
        if id.len() == 0 || name.len() == 0 { return Err(VaultError::Invalid); }
        if env.storage().persistent().has(&DataKey::Cedente(id.clone())) { return Err(VaultError::DuplicateId); }

        let rec = EntityRecord { id: id.clone(), name, created_by: who.clone(), status: Status::Pending };
        env.storage().persistent().set(&DataKey::Cedente(id.clone()), &rec);
        env.events().publish((symbol_short!("entity_submit"), symbol_short!("cedente"), id), 0i128);
        Ok(())
    }

    pub fn submit_sacado(env: Env, id: String, name: String) -> Result<(), VaultError> {
        let who = env.invoker();
        if !Self::is_consultant(&env, &who) { return Err(VaultError::NotConsultant); }
        if id.len() == 0 || name.len() == 0 { return Err(VaultError::Invalid); }
        if env.storage().persistent().has(&DataKey::Sacado(id.clone())) { return Err(VaultError::DuplicateId); }

        let rec = EntityRecord { id: id.clone(), name, created_by: who.clone(), status: Status::Pending };
        env.storage().persistent().set(&DataKey::Sacado(id.clone()), &rec);
        env.events().publish((symbol_short!("entity_submit"), symbol_short!("sacado"), id), 0i128);
        Ok(())
    }

    pub fn submit_fund(env: Env, id: String, name: String, token_addr: Address) -> Result<(), VaultError> {
        let who = env.invoker();
        if !Self::is_consultant(&env, &who) { return Err(VaultError::NotConsultant); }
        if id.len() == 0 || name.len() == 0 { return Err(VaultError::Invalid); }
        if env.storage().persistent().has(&DataKey::Fund(id.clone())) { return Err(VaultError::DuplicateId); }

        let rec = FundRecord { id: id.clone(), name, created_by: who.clone(), status: Status::Pending, token: token_addr };
        env.storage().persistent().set(&DataKey::Fund(id.clone()), &rec);
        env.events().publish((symbol_short!("entity_submit"), symbol_short!("fund"), id), 0i128);
        Ok(())
    }

    // -------- Aprovação pelo Gestor --------
    pub fn approve_entity(env: Env, kind: String, id: String, approve: bool) -> Result<(), VaultError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        let st = if approve { Status::Approved } else { Status::Rejected };

        match kind.as_bytes() {
            b"cedente" => {
                let mut e: EntityRecord = env.storage().persistent().get(&DataKey::Cedente(id.clone())).ok_or(VaultError::NotFound)?;
                e.status = st;
                env.storage().persistent().set(&DataKey::Cedente(id.clone()), &e);
            }
            b"sacado" => {
                let mut e: EntityRecord = env.storage().persistent().get(&DataKey::Sacado(id.clone())).ok_or(VaultError::NotFound)?;
                e.status = st;
                env.storage().persistent().set(&DataKey::Sacado(id.clone()), &e);
            }
            b"fund" => {
                let mut f: FundRecord = env.storage().persistent().get(&DataKey::Fund(id.clone())).ok_or(VaultError::NotFound)?;
                f.status = st;
                env.storage().persistent().set(&DataKey::Fund(id.clone()), &f);
            }
            _ => return Err(VaultError::Invalid),
        }
        env.events().publish((symbol_short!("entity_approve"), kind, id), approve);
        Ok(())
    }

    // -------- Recebíveis --------
    pub fn register_receivable(
        env: Env,
        id: String,
        fund_id: String,
        cedente_id: String,
        sacado_id: String,
        face_value: i128,
        due_date: u64,
        debtor_address: Address,
    ) -> Result<(), VaultError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if face_value <= 0 { return Err(VaultError::Invalid); }
        if env.storage().persistent().has(&DataKey::Receivable(id.clone())) { return Err(VaultError::DuplicateId); }

        // checagens de aprovação
        let fund: FundRecord = env.storage().persistent().get(&DataKey::Fund(fund_id.clone())).ok_or(VaultError::NotFound)?;
        if let Status::Approved = fund.status {} else { return Err(VaultError::BadStatus); }

        let sac: EntityRecord = env.storage().persistent().get(&DataKey::Sacado(sacado_id.clone())).ok_or(VaultError::NotFound)?;
        if let Status::Approved = sac.status {} else { return Err(VaultError::BadStatus); }

        let _ced: EntityRecord = env.storage().persistent().get(&DataKey::Cedente(cedente_id.clone())).ok_or(VaultError::NotFound)?; // status opcional

        let r = Receivable {
            id: id.clone(),
            fund_id: fund_id.clone(),
            cedente_id,
            sacado_id,
            face_value,
            due_date,
            debtor_address,
            status: ReceivableStatus::Pending,
            paid_amount: 0,
            paid_date: 0,
        };
        env.storage().persistent().set(&DataKey::Receivable(id.clone()), &r);

        let cnt: u32 = env.storage().instance().get(&DataKey::ReceivableCount).unwrap_or(0);
        env.storage().instance().set(&DataKey::ReceivableCount, &(cnt + 1));
        env.events().publish((symbol_short!("rcv_reg"), fund_id, id), face_value);
        Ok(())
    }

    pub fn mark_paid(env: Env, id: String, amount: i128) -> Result<(), VaultError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        if amount <= 0 { return Err(VaultError::Invalid); }

        let mut r: Receivable = env.storage().persistent().get(&DataKey::Receivable(id.clone())).ok_or(VaultError::NotFound)?;
        match r.status {
            ReceivableStatus::Pending => {},
            _ => return Err(VaultError::BadStatus),
        }

        r.status = ReceivableStatus::Paid;
        r.paid_amount = amount;
        r.paid_date = env.ledger().timestamp();
        env.storage().persistent().set(&DataKey::Receivable(id.clone()), &r);

        let tot: i128 = env.storage().instance().get(&DataKey::TotalPaid).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalPaid, &add(tot, amount)?);
        env.events().publish((symbol_short!("rcv_paid"), r.fund_id, id), amount);
        Ok(())
    }

    /// holders: lista de endereços a considerar no snapshot
    /// pró-rata pelos saldos *atuais* no FundToken vinculado ao fundo do recebível
    pub fn distribute(env: Env, receivable_id: String, holders: Vec<Address>) -> Result<(), VaultError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut r: Receivable = env.storage().persistent().get(&DataKey::Receivable(receivable_id.clone())).ok_or(VaultError::NotFound)?;
        if let ReceivableStatus::Paid = r.status {} else { return Err(VaultError::BadStatus); }

        // pega o token do fundo
        let fund: FundRecord = env.storage().persistent().get(&DataKey::Fund(r.fund_id.clone())).ok_or(VaultError::NotFound)?;
        let token_addr = fund.token;

        // soma saldos
        let mut total_shares: i128 = 0;
        let mut balances: Vec<i128> = vec![&env];
        let mut max_idx: i32 = -1;
        let mut max_bal: i128 = 0;

        for (i, h) in holders.iter().enumerate() {
            // cross-contract call: FundToken::balance(env, h)
            let bal: i128 = token_addr
                .call::<i128>(&env, symbol_short!("balance"), (h.clone(),));
            balances.push_back(bal);
            total_shares = add(total_shares, bal)?;
            if bal > max_bal { max_bal = bal; max_idx = i as i32; }
        }
        if total_shares <= 0 { return Err(VaultError::Invalid); }

        // distribuição
        let paid = r.paid_amount;
        let mut distributed_sum: i128 = 0;

        for (i, h) in holders.iter().enumerate() {
            let bal = balances.get(i as u32).unwrap();
            if *bal == 0 { continue; }
            let share = (*bal * paid) / total_shares;
            if share > 0 {
                distributed_sum = add(distributed_sum, share)?;
                // emit apenas evento (MVP). Em produção, faça transferências do ativo de pagamento.
                env.events().publish((symbol_short!("dist"), r.fund_id.clone(), h.clone()), share);
            }
        }
        // resíduo
        let residue = sub(paid, distributed_sum)?;
        if residue > 0 && max_idx >= 0 {
            let h = holders.get(max_idx as u32).unwrap();
            env.events().publish((symbol_short!("dist_residue"), r.fund_id.clone(), h.clone()), residue);
        }

        r.status = ReceivableStatus::Distributed;
        env.storage().persistent().set(&DataKey::Receivable(receivable_id.clone()), &r);
        env.events().publish((symbol_short!("dist_sum"), r.fund_id, receivable_id), paid);
        Ok(())
    }

    // -------- Views --------
    pub fn get_receivable(env: Env, id: String) -> Result<Receivable, VaultError> {
        env.storage().persistent().get(&DataKey::Receivable(id)).ok_or(VaultError::NotFound)
    }
    pub fn get_receivables_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::ReceivableCount).unwrap_or(0)
    }
    pub fn get_total_paid(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalPaid).unwrap_or(0)
    }
    pub fn get_fund_token_address(env: Env) -> Address {
        env.storage().instance().get(&DataKey::FundTokenAddress).unwrap()
    }
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }
}
