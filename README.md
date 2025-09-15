📦 MVP (24h) — “do zero ao demo”
Objetivo do MVP
Provar o fluxo ponta-a-ponta com o mínimo funcional:
Consultor cadastra Cedente e Sacado (mock de KYC);


Gestor emite um Fundo (token) e recebível vinculado;


Investidor compra cotas do Fundo;


Sacado paga (simulado) e o Fundo redistribui pro Investidor.


Cortes intencionais: on/off-ramp BRL real (simular em USDC ou XLM), KYC real (mock), múltiplas safras/ativos complexos (1 fundo, 1 recebível), tela mobile (web only), auditoria avançada (somente logs on-chain + painel simples).

🧩 Arquitetura mínima
Frontend: React + Tailwind (ou Next.js).


Backend: Node/TypeScript (API fina) chamando Horizon e soroban-cli (ou SDK) para contratos.


Blockchain: Stellar Testnet + Soroban.


DB: SQLite/Prisma (ou Supabase) só para estados off-chain (usuários, perfis e vínculos).


Identidade: mock (email + senha); gerar chaves Stellar no onboarding.


Pagamentos em massa: simular via chamada em lote (loop) — não precisa integrar a SDP agora (mostramos “pronto para SDP”).



🧑‍💻 Time (5 pessoas) — divisão de trabalho
Lead/PM + Pitch: prioriza features, roteiriza demo, cuida do storytelling.


FE Dev: telas (Gestor/Consultor/Investidor), chamada de API, carteira light (exibir chave pública, saldo, aprovar trustline).


BE Dev: endpoints (auth, cadastro, emissão, compra, pagamento, distribuição), integração Horizon/Soroban.


Smart Contracts: escrever/deploy Soroban; utilitários (emissão, whitelist, distribuição).


SRE/QA: preparar scripts seed, chaves testnet, dados fakes, smoke tests, gravação da demo.



🗂️ Telas do MVP
Login & Onboarding (Consultor / Gestor / Investidor)


Gera par de chaves Stellar; mostra public key.


Consultor — Cadastro


Formulário Cedente e Sacado (mock KYC); “Enviar para aprovação”.


Gestor — Aprovação & Emissão


Lista de cadastros pendentes; aprova.


Wizard: Criar Fundo (token) → define ticker, supply (ex.: 1.000), preço alvo.


Criar Recebível vinculado (valor, vencimento, sacado).


Botão “Emitir”: chama contrato.


Investidor — Portal do Fundo


Ver dados do Fundo (supply, cotas disponíveis, holders, lastro).


Comprar Cotas (payment + abrir trustline se necessário).


Listar no DEX (opcional: criar oferta de venda).


Gestor — Liquidação & Distribuição


Botão “Registrar pagamento do Sacado” (simulado);


“Distribuir pro-rata” (chama contrato de distribuição).



🧠 Contratos Soroban — escopos e funções
Keep it simple: 2 contratos agora, 1 utilitário opcional. Tudo com role-based access (gestor = admin).
1) FundToken (fungível + governança simples)
Objetivo: representar as cotas do fundo como token fungível com whitelist e travas.
init(admin, name, symbol, decimals, max_supply)


whitelist_add(address) / whitelist_remove(address)


mint(to, amount) — somente admin


transfer(from, to, amount) — só se to estiver na whitelist (para MVP)


balanceOf(address), totalSupply()


(Opcional) pause() / unpause() (em caso de demo, pode omitir)


Por que no contrato e não no token nativo?
 Precisamos de whitelist e regras, e queremos demonstrar governança mínima.
2) ReceivableVault (registro de recebíveis + distribuição)
Objetivo: custodiar valores pagos pelo Sacado e distribuir pro-rata aos holders do FundToken.
init(admin, fund_token_address)


register_receivable(id, face_value, due_date, debtor_address) — só admin


mark_paid(id, amount) — registra o pagamento do sacado (simulado no MVP)


distribute() — lê totalSupply e balances do FundToken, envia proporcionalmente
 Implementação MVP:


Snapshot simples no momento da chamada;


Itera top N holders em lista mantida off-chain e passada como parâmetro (para não estourar gás/loop grande).


Em produção: índices on-chain ou rounds de distribuição.


Segurança: somente admin pode mark_paid/distribute no MVP (com log on-chain).


(Opcional) 3) KYCRegistry
Objetivo: centralizar whitelist por papel (investidor, gestor, consultor).
set_role(address, role); has_role(address, role)


No MVP, podemos embutir a whitelist no FundToken (menos contratos = mais velocidade).

🔌 Fluxo técnico on-chain (MVP)
Onboarding → gerar chaves; backend guarda somente public key (private no browser).


Aprovação (Gestor) → chama whitelist_add para Consultor e Investidor.


Emissão → FundToken.init → mint para a tesouraria do fundo.


Recebível → ReceivableVault.register_receivable.


Compra de cotas → Backend faz transfer do FundToken para investidor após receber payment (pode ser XLM/USDC simulado).


Pagamento do sacado → mark_paid(id, amount) no ReceivableVault.


Distribuição → distribute() pro-rata para holders.



🔁 Integrações Stellar (operações/SDK)
Horizon: consulta saldos, submissão de transações.


Trustline: ao comprar cotas, frontend chama change_trust para aceitar FundToken.


SDEX (opcional): manage_sell_offer para listar cotas do fundo; mostrar oferta na UI.


Soroban: deploy via soroban-cli ou SDK; chamadas invoke para as funções acima.



🗃️ Modelo de dados (off-chain, mínimo)
users: id, email, role (gestor/consultor/investidor), public_key


cedentes: id, nome, docs (mock), status


sacados: id, nome, docs (mock), status


funds: id, name, symbol, contract_address, max_supply


receivables: id, fund_id, face_value, due_date, debtor_id, status


orders: id, investor_id, fund_id, qty, price, status (para exibir “compras”)


holders_snapshot: fund_id, [{address, balance}] (para distribute() no MVP)



🕒 Linha do tempo (24h)
Hora 0–2: Kickoff, definir demo, criar repositório monorepo (apps/web, apps/api, contracts/).
 Hora 2–6:
FE: Login + Telas de Cadastro (Consultor) e Aprovação (Gestor).


BE: Auth mock + rotas CRUD + geração de chaves.


SC: Scaffold dos contratos FundToken e ReceivableVault.
 Hora 6–12:


SC: Implementar/migrar, deploy testnet, endereços expostos.


BE: Serviços para init/mint/whitelist_add/transfer/register_receivable/mark_paid/distribute.


FE: Telas Gestor (emissão), Investidor (comprar cotas).
 Hora 12–18:


Integração ponta-a-ponta, seed de dados, simular pagamento do sacado.


Tela “Distribuir” com feedback de transação (hash + link no explorer).
 Hora 18–22:


Polimento UI, loading states, toasts, validações mínimas.


(Opcional) SDEX: listar oferta de venda e mostrar book.
 Hora 22–24:


Ensaio da demo, script, gravação de vídeo curto de backup.



🎬 Roteiro da demo (2–3 min)
Consultor cadastra Cedente/Sacado (aprovação pendente).


Gestor aprova e cria Fundo SOJA25 (emite cotas).


Investidor abre trustline e compra 100 cotas (mostrar saldo on-chain).


Sacado paga (simulado) → Distribuir → investidor recebe rendimento (mostrar hash e saldo atualizado).


(Opcional) Listar 50 cotas no DEX e mostrar ordem.



🧱 Riscos e mitigação
Tempo de contrato: começar com FundToken + distribuição simplificada; sem KYCRegistry.


Loops on-chain: limitar distribuição a lista de holders (top N) passada via parâmetro; mostrar que “em produção usamos rounds/merkle”.


Chaves: manter privada no browser (localStorage *apenas para demo*), nunca no backend.


On/Off-ramp: simular com XLM/USDC testnet; no pitch, mencionar SDP/âncora BRL como próximo passo.



🧭 Próximos passos pós-MVP (pitch)
Plug & play com Stellar Disbursement Platform (SDP).


Âncora BRL ou bank partner para on/off-ramp.


Compliance: KYC real, whitelist regulatória, logs para auditoria.


Liquidez: market maker leve no SDEX; boletagem com FIIs/FDICs.




🎯 MVP Enxuto com Gestor + Consultor + Investidor
(4 telas principais, sem sobrecarga)

👨‍💼 Consultor
Tela: Cadastro de Cedente/Sacado
Campos mínimos: Nome, CNPJ/CPF, Endereço, Chave Pública Stellar (gerada no onboarding).


Ações: “Salvar e Enviar ao Gestor”.


Estados: Pendente / Aprovado / Reprovado (mostra o status).
 👉 Sem documentos complexos nem múltiplas telas – só o formulário básico.



🧑‍💼 Gestor
Tela: Aprovação de Cadastros
Lista simples de cadastros enviados por consultores.


Para cada item: Nome + Tipo (cedente/sacado) + CNPJ + Botões [Aprovar] [Reprovar].
 👉 Ao aprovar, o sistema guarda off-chain e (se quiser enriquecer) cria trustline automática.


Tela: Gestão do Fundo
Botão Criar Fundo (nome, símbolo, supply).


Lista de fundos ativos (nome, supply, cotas vendidas).


Ação: Emitir cotas (mint) → ficam disponíveis para venda.


Tela: Recebíveis e Distribuição
Botão “Registrar pagamento do sacado” (valor).


Botão “Distribuir pro-rata” (chama contrato).
 👉 Isso simula o ciclo completo com só 2 ações.



👩‍💻 Investidor
Tela: Portal do Fundo
Lista de fundos (nome, supply, cotas disponíveis).


Botão Comprar cotas (ex.: 100 cotas).


Mostra saldo atual do investidor + hash da transação.


Tela: Minha Carteira
Lista de fundos investidos + saldo em cotas.


Histórico simplificado (hashes das últimas transações).
 👉 Tudo bem enxuto: só compra e acompanha.



🔑 Fluxo demonstrável
Consultor cadastra um cedente e um sacado.


Gestor aprova o cadastro.


Gestor cria um fundo e emite cotas.


Investidor compra cotas (trustline + transfer).


Gestor registra pagamento do sacado e distribui o rendimento → investidor vê saldo aumentar.





📄 Documento da Solução – Plataforma de Fundos Tokenizados em Stellar

1. Visão Geral
Nossa solução é uma plataforma de tokenização e gestão de fundos de recebíveis (FIDCs) construída sobre a blockchain Stellar, com foco inicial em fundos agrícolas como caso de uso demonstrativo.
A plataforma permite que consultores e gestores de DTVMs registrem cedentes e sacados, criem fundos, emitam cotas digitais e distribuam rendimentos de forma manual, mas transparente e registrada em blockchain.
Com Stellar, garantimos:
Transparência: todas as operações ficam registradas on-chain.


Confiabilidade: uso do Stellar Consensus Protocol (SCP) e contratos Soroban.


Baixo custo e velocidade: transações quase instantâneas e taxas irrisórias.


Liquidez futura: cotas podem ser negociadas no Stellar DEX.



2. Atores da Plataforma
👨‍💼 Consultor
Cadastra cedentes (quem cede os recebíveis) e sacados (quem deve pagar).


Submete cadastros ao Gestor.


🧑‍💼 Gestor (DTVM)
Aprova cadastros de consultores.


Cria fundos, emite cotas tokenizadas e registra recebíveis.


Após pagamento do sacado, executa distribuição manual para os investidores.


👩‍💻 Investidor
Compra cotas tokenizadas dos fundos.


Acompanha saldo de cotas e histórico de distribuições.


🏭 Sacado (pagador)
Empresa ou trading que paga os recebíveis.


No MVP, o pagamento é registrado manualmente pelo Gestor.


🌱 Cedente (originador)
Produtor/empresa que origina o recebível.


Interação apenas via cadastro feito pelo Consultor.



3. Features Entregues no MVP
Consultor
Cadastro de Cedente/Sacado (Nome, CNPJ/CPF, chave Stellar).


Envio ao Gestor para aprovação.


Acompanhamento do status (pendente/aprovado/reprovado).


Gestor
Aprovação de cadastros enviados por consultores.


Criação de Fundo: define nome, ticker, supply → emite cotas (FundToken).


Registro de Recebíveis: valor nominal, vencimento, sacado vinculado.


Registro manual de pagamento do sacado.


Distribuição manual de rendimentos para cotistas (via contrato ReceivableVault).


Investidor
Lista de Fundos: fundos disponíveis e métricas básicas.


Compra de Cotas: abre trustline e recebe tokens.


Minha Carteira: mostra cotas detidas e histórico de distribuições.


Sacado (mock)
Pagamento registrado manualmente pelo Gestor.


Cedente (mock)
Apenas cadastrado pelo Consultor.

🚀 Processo de Inovação e Valor Entregue
🌍 Contexto Atual
Fundos de recebíveis (FIDCs, agrícolas ou não) no Brasil enfrentam dores estruturais:
Burocracia alta: registros em cartórios, processos manuais e auditorias demoradas.


Falta de transparência: investidores só recebem relatórios periódicos, sem visão em tempo real.


Distribuição cara e lenta: pagamentos a dezenas/centenas de cotistas exigem boletagem manual e sistemas legados.


Liquidez limitada: cotas são, na prática, “travas” até o vencimento do fundo.


Essas fricções aumentam custos, reduzem a confiança e dificultam o acesso de investidores menores.

💡 Inovação Proposta
A inovação está em migrar a gestão de fundos para a blockchain Stellar, explorando características únicas:
Tokenização de Cotas (Ativos Digitais Fungíveis)


Cada cota do fundo vira um token fungível emitido em Stellar.


Os investidores passam a segurar cotas em suas carteiras digitais, com registro público e auditável.


Isso elimina intermediários para comprovar posse → basta consultar o ledger.


Registro Transparente de Recebíveis


Cada recebível do fundo (ex.: CPR agrícola) é registrado em contrato inteligente.


O status (pendente, pago, distribuído) fica visível e imutável.


Gera confiança e simplifica auditorias.


Distribuição On-Chain


O gestor executa uma função única (distribute) que redistribui valores para todos os cotistas.


Sai o processo de boletagem manual → entra a execução transparente e rastreável.


Cada cotista pode comprovar que recebeu sua parte direto na carteira, sem depender de relatórios internos.


Possibilidade de Liquidez Secundária


Como as cotas são tokens fungíveis, podem ser negociadas no Stellar DEX.


Isso cria um mercado secundário para cotas de fundos, algo quase inexistente hoje.



🎯 Valor Entregue
Para Gestores e DTVMs
Redução de custos operacionais → menos intermediários, menos retrabalho.


Governança mais robusta → regras codificadas em contratos, compliance simplificado.


Confiança dos investidores → transparência on-chain reduz assimetria de informação.


Para Consultores
Ferramenta digital clara → facilita captar cedentes e sacados.


Mais credibilidade → mostrar que a originação vai para um fundo auditável em blockchain.


Para Investidores
Prova de propriedade em tempo real → não dependem de custodiantes/operações manuais.


Confiança na distribuição → tudo rastreável on-chain.


Potencial de liquidez → vender cotas antes do vencimento via mercado secundário.


Para o Mercado
Acesso democratizado → fundos estruturados deixam de ser “caixa-preta”.


Auditoria facilitada → reguladores e terceiros podem acompanhar no ledger.


Padronização e interoperabilidade → contratos replicáveis para diferentes classes de fundos.

