---
title: "Smart Contracts Details"
sidebar_position: 2
---

# Smart Contracts Details

Our platform leverages two main Soroban smart contracts to enable secure, auditable, and role-based management of tokenized receivables funds on Stellar:

## FundToken Contract

The `FundToken` contract is a custom fungible token implementation designed for representing fund shares with advanced governance and compliance features.

**Key Features:**
- **Initialization:**
  - Sets admin, name, symbol, decimals, and max supply.
  - Ensures only one-time setup and valid parameters.
- **Whitelist (KYC/AML):**
  - Only whitelisted addresses can receive tokens.
  - Admin can add or remove addresses from the whitelist.
  - Emits events for whitelist changes.
- **Minting:**
  - Only admin can mint new tokens, up to the max supply.
  - Minting is only allowed for whitelisted addresses.
  - Emits events for mint operations.
- **Transfers:**
  - Only allowed if the contract is not paused.
  - Only to whitelisted addresses.
  - Checks for sufficient balance and emits transfer events.
- **Pause/Unpause:**
  - Admin can pause or unpause all token operations for security.
- **Views:**
  - Query balance, total supply, max supply, decimals, name, symbol, admin, and paused status.
- **Security:**
  - All admin actions require authentication.
  - Arithmetic is checked for overflow/underflow.

## ReceivableVault Contract

The `ReceivableVault` contract manages the registration, approval, and distribution of receivables linked to specific funds and their token contracts.

**Key Features:**
- **Initialization & Roles:**
  - Sets admin and links to a specific FundToken contract.
  - Admin can whitelist consultants who can propose new entities and funds.
- **Entity Management:**
  - Consultants can submit new Cedentes (originators), Sacados (debtors), and Funds for approval.
  - Admin approves or rejects each entity, updating their status.
- **Receivable Registration:**
  - Admin can register new receivables, linking them to approved funds, cedentes, and sacados.
  - Validates all references and statuses before registration.
- **Receivable Payment:**
  - Admin can mark a receivable as paid, recording the amount and timestamp.
  - Tracks total paid amounts.
- **Pro-rata Distribution:**
  - After payment, admin can trigger distribution to a list of holders.
  - Uses cross-contract call to FundToken to get each holder's balance.
  - Distributes paid amount proportionally to holders' shares, handling rounding residue.
  - Emits events for each distribution and residue.
- **Views:**
  - Query receivables, counts, total paid, fund token address, and admin.
- **Security:**
  - All admin and consultant actions require authentication.
  - Checks for duplicate IDs, valid statuses, and safe math.

## Stellar Integration

Our platform leverages the Stellar blockchain as the foundation for all on-chain operations:

- **Tokenization:** Fund shares are represented as custom tokens on Stellar, managed by the FundToken contract.
- **Smart Contracts:** All business logic for fund governance, whitelisting, receivable registration, and pro-rata distribution is implemented as Soroban smart contracts deployed on Stellar Testnet.
- **Wallets:** Each user (manager, consultant, investor) has a Stellar wallet generated during onboarding. All balances, transfers, and distributions are visible and auditable on-chain.
- **Transactions:** Minting, transfers, and distributions are executed as Stellar transactions, with events emitted for full traceability.
- **Compliance:** Whitelisting and role-based access are enforced at the contract level, ensuring only authorized and KYC'd users can interact with fund tokens.
- **Integration:** The backend communicates with Stellar via Horizon API and Soroban CLI/SDK for contract deployment and invocation, while the frontend displays real-time on-chain data to users.

This approach ensures transparency, security, and interoperability for all fund operations, leveraging Stellar's speed and low transaction costs.

---

These contracts together provide a robust, auditable, and role-based foundation for tokenized fund management and receivable distribution on Stellar.