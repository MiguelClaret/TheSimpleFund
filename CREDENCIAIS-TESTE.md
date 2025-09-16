# 🔐 Credenciais de Teste - VERO Platform

Este documento contém as credenciais de teste criadas para demonstrar todas as funcionalidades da plataforma VERO.

## 📋 Credenciais de Acesso

### 👨‍💼 GESTOR
- **Email:** `gestor@vero.com`
- **Senha:** `123456`
- **Status:** APROVADO
- **Funcionalidades:**
  - Aprovar/rejeitar consultores e investidores
  - Aprovar/rejeitar fundos
  - Aprovar/rejeitar cedentes e sacados
  - Visualizar todos os dados da plataforma

### 👨‍💻 CONSULTOR
- **Email:** `consultor@vero.com`
- **Senha:** `123456`
- **Status:** APROVADO
- **Funcionalidades:**
  - Criar e gerenciar fundos
  - Gerenciar cedentes e sacados por fundo
  - Criar recebíveis
  - **Fundos Criados:**
    - 🌾 **Fundo de Recebíveis Agro** (VERO-AGRO) - APROVADO
    - 🏢 **Fundo Imobiliário Comercial** (VERO-IMOB) - PENDENTE
    - 💻 **Fundo Tech Startups** (VERO-TECH) - APROVADO

### 💰 INVESTIDOR
- **Email:** `investidor@vero.com`
- **Senha:** `123456`
- **Status:** APROVADO
- **Funcionalidades:**
  - Visualizar fundos disponíveis
  - Fazer investimentos
  - Acompanhar carteira
  - **Investimentos Realizados:**
    - 10 cotas no Fundo Agro (R$ 1.000) - COMPLETO
    - 25 cotas no Fundo Tech (R$ 2.500) - PENDENTE

## ⏳ Usuários Pendentes (Para Testar Aprovação)

### 👨‍💻 CONSULTOR PENDENTE
- **Email:** `consultor.pendente@vero.com`
- **Senha:** `123456`
- **Status:** PENDENTE DE APROVAÇÃO

### 💰 INVESTIDOR PENDENTE
- **Email:** `investidor.pendente@vero.com`
- **Senha:** `123456`
- **Status:** PENDENTE DE APROVAÇÃO

## 📊 Dados de Teste Criados

### 🏦 Fundos
1. **Fundo de Recebíveis Agro** (VERO-AGRO)
   - Meta: R$ 1.000.000
   - Oferta: 10.000 cotas
   - Preço: R$ 100/cota
   - Status: APROVADO
   - Cedentes: AgroTech Solutions Ltda, Fazenda Santa Clara S/A
   - Sacados: Cooperativa Agrícola Regional

2. **Fundo Imobiliário Comercial** (VERO-IMOB)
   - Meta: R$ 500.000
   - Oferta: 5.000 cotas
   - Preço: R$ 100/cota
   - Status: PENDENTE

3. **Fundo Tech Startups** (VERO-TECH)
   - Meta: R$ 1.500.000
   - Oferta: 15.000 cotas
   - Preço: R$ 100/cota
   - Status: APROVADO
   - Cedentes: InnovaTech Labs
   - Sacados: TechCorp Brasil

### 🏢 Cedentes e Sacados por Fundo
- **Fundo Agro:** 2 cedentes, 1 sacado
- **Fundo Tech:** 1 cedente, 1 sacado
- Todos com status variados (aprovados/pendentes)

### 📄 Recebíveis
- 2 recebíveis de exemplo vinculados aos fundos
- Valores entre R$ 50.000 e R$ 75.000
- Vencimentos em 2025 e 2026

### 💸 Ordens de Investimento
- 2 ordens criadas pelo investidor
- Status: 1 completa, 1 pendente
- Total investido: R$ 3.500

## 🚀 Como Testar

1. **Acesse:** http://localhost:5174
2. **Faça login** com qualquer uma das credenciais acima
3. **Explore as funcionalidades** de cada tipo de usuário:

### Como GESTOR:
- Acesse o dashboard do gestor
- Aprove/rejeite usuários pendentes
- Aprove/rejeite fundos pendentes
- Visualize todos os dados da plataforma

### Como CONSULTOR:
- Acesse "Meus Fundos"
- Clique em "Gerenciar Cedentes/Sacados" em qualquer fundo
- Adicione novos cedentes/sacados específicos para cada fundo
- Crie novos fundos

### Como INVESTIDOR:
- Visualize fundos disponíveis
- Faça novos investimentos
- Acompanhe sua carteira

## 💡 Funcionalidades Demonstradas

✅ **Sistema de Aprovação Completo**
- Usuários, fundos, cedentes e sacados requerem aprovação

✅ **Arquitetura Fund-Specific**
- Cedentes e sacados são específicos por fundo
- Navegação contextual por fundo

✅ **Roles e Permissões**
- Gestor: controle total
- Consultor: gerencia seus fundos
- Investidor: realiza investimentos

✅ **Fluxo de Investimento**
- Validação de quotas disponíveis
- Cálculo automático de preços
- Status de ordens

✅ **Interface Responsiva**
- Dashboard específico por role
- Navegação intuitiva
- Formulários validados

## 🛠️ Scripts Disponíveis

Para recriar os dados de teste:
```bash
cd apps/api
node scripts/seed-test-data.js
```

---

**Desenvolvido pela equipe VERO Platform** 🚀