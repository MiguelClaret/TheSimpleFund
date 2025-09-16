import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('🗃️  Limpando dados existentes...');
    
    // Limpar dados existentes na ordem correta devido às foreign keys
    await prisma.order.deleteMany();
    await prisma.receivable.deleteMany();
    await prisma.cedente.deleteMany();
    await prisma.sacado.deleteMany();
    await prisma.fund.deleteMany();
    await prisma.user.deleteMany();

    console.log('👥 Criando usuários de teste...');

    // Senha padrão para todos os usuários de teste
    const defaultPassword = await bcrypt.hash('123456', 10);

    // 1. Criar GESTOR
    const gestor = await prisma.user.create({
      data: {
        email: 'gestor@vero.com',
        password: defaultPassword,
        role: 'GESTOR',
        status: 'APPROVED'
      }
    });
    console.log('✅ Gestor criado:', gestor.email);

    // 2. Criar CONSULTOR
    const consultor = await prisma.user.create({
      data: {
        email: 'consultor@vero.com',
        password: defaultPassword,
        role: 'CONSULTOR',
        status: 'APPROVED'
      }
    });
    console.log('✅ Consultor criado:', consultor.email);

    // 3. Criar INVESTIDOR
    const investidor = await prisma.user.create({
      data: {
        email: 'investidor@vero.com',
        password: defaultPassword,
        role: 'INVESTIDOR',
        status: 'APPROVED'
      }
    });
    console.log('✅ Investidor criado:', investidor.email);

    // 4. Criar usuários adicionais pendentes para demonstrar aprovação
    const consultorPendente = await prisma.user.create({
      data: {
        email: 'consultor.pendente@vero.com',
        password: defaultPassword,
        role: 'CONSULTOR',
        status: 'PENDING'
      }
    });
    console.log('⏳ Consultor pendente criado:', consultorPendente.email);

    const investidorPendente = await prisma.user.create({
      data: {
        email: 'investidor.pendente@vero.com',
        password: defaultPassword,
        role: 'INVESTIDOR',
        status: 'PENDING'
      }
    });
    console.log('⏳ Investidor pendente criado:', investidorPendente.email);

    console.log('💰 Criando fundos de teste...');

    // 5. Criar fundos para o consultor
    const fundo1 = await prisma.fund.create({
      data: {
        name: 'Fundo de Recebíveis Agro',
        description: 'Fundo focado em recebíveis do agronegócio brasileiro',
        symbol: 'VERO-AGRO',
        maxSupply: 10000,
        targetAmount: 1000000,
        price: 100,
        status: 'APPROVED',
        consultorId: consultor.id
      }
    });
    console.log('✅ Fundo criado:', fundo1.name);

    const fundo2 = await prisma.fund.create({
      data: {
        name: 'Fundo Imobiliário Comercial',
        description: 'Recebíveis de contratos comerciais urbanos',
        symbol: 'VERO-IMOB',
        maxSupply: 5000,
        targetAmount: 500000,
        price: 100,
        status: 'PENDING',
        consultorId: consultor.id
      }
    });
    console.log('✅ Fundo criado:', fundo2.name);

    const fundo3 = await prisma.fund.create({
      data: {
        name: 'Fundo Tech Startups',
        description: 'Recebíveis de empresas de tecnologia',
        symbol: 'VERO-TECH',
        maxSupply: 15000,
        targetAmount: 1500000,
        price: 100,
        status: 'APPROVED',
        consultorId: consultor.id
      }
    });
    console.log('✅ Fundo criado:', fundo3.name);

    console.log('🏢 Criando cedentes e sacados por fundo...');

    // 6. Criar cedentes e sacados para Fundo Agro
    const cedenteAgro1 = await prisma.cedente.create({
      data: {
        name: 'AgroTech Solutions Ltda',
        document: '12.345.678/0001-90',
        address: 'Rua das Plantações, 123 - Sertãozinho/SP',
        publicKey: 'GCDVZQWV4PSK6GJTOPXU5QOWQJRPSXCZQMQM6QWO3XQHQJQX5Q6WDZQW',
        status: 'APPROVED',
        consultorId: consultor.id,
        fundId: fundo1.id
      }
    });

    const cedenteAgro2 = await prisma.cedente.create({
      data: {
        name: 'Fazenda Santa Clara S/A',
        document: '98.765.432/0001-10',
        address: 'Estrada Rural, KM 15 - Ribeirão Preto/SP',
        status: 'PENDING',
        consultorId: consultor.id,
        fundId: fundo1.id
      }
    });

    const sacadoAgro1 = await prisma.sacado.create({
      data: {
        name: 'Cooperativa Agrícola Regional',
        document: '11.222.333/0001-44',
        address: 'Centro de Distribuição - Araraquara/SP',
        status: 'APPROVED',
        consultorId: consultor.id,
        fundId: fundo1.id
      }
    });

    // 7. Criar cedentes e sacados para Fundo Tech
    const cedenteTech1 = await prisma.cedente.create({
      data: {
        name: 'InnovaTech Labs',
        document: '55.666.777/0001-88',
        address: 'Av. Paulista, 1000 - São Paulo/SP',
        publicKey: 'GCDVZQWV4PSK6GJTOPXU5QOWQJRPSXCZQMQM6QWO3XQHQJQX5Q6WDZQW',
        status: 'APPROVED',
        consultorId: consultor.id,
        fundId: fundo3.id
      }
    });

    const sacadoTech1 = await prisma.sacado.create({
      data: {
        name: 'TechCorp Brasil',
        document: '77.888.999/0001-22',
        address: 'Rua da Inovação, 456 - São Paulo/SP',
        status: 'APPROVED',
        consultorId: consultor.id,
        fundId: fundo3.id
      }
    });

    console.log('📊 Criando recebíveis de exemplo...');

    // 8. Criar alguns recebíveis
    const receivable1 = await prisma.receivable.create({
      data: {
        faceValue: 50000,
        dueDate: new Date('2025-12-31'),
        status: 'PENDING',
        sacadoId: sacadoAgro1.id,
        fundId: fundo1.id
      }
    });

    const receivable2 = await prisma.receivable.create({
      data: {
        faceValue: 75000,
        dueDate: new Date('2026-06-30'),
        status: 'PENDING',
        sacadoId: sacadoTech1.id,
        fundId: fundo3.id
      }
    });

    console.log('💸 Criando ordens de investimento...');

    // 9. Criar algumas ordens de investimento
    const order1 = await prisma.order.create({
      data: {
        quantity: 10,
        price: 100,
        total: 1000,
        status: 'COMPLETED',
        investorId: investidor.id,
        fundId: fundo1.id
      }
    });

    const order2 = await prisma.order.create({
      data: {
        quantity: 25,
        price: 100,
        total: 2500,
        status: 'PENDING',
        investorId: investidor.id,
        fundId: fundo3.id
      }
    });

    // Atualizar totalIssued dos fundos
    await prisma.fund.update({
      where: { id: fundo1.id },
      data: { totalIssued: 10 }
    });

    console.log('\n🎉 Dados de teste criados com sucesso!\n');
    
    console.log('📋 CREDENCIAIS DE TESTE:');
    console.log('═══════════════════════════════════════');
    console.log('👨‍💼 GESTOR:');
    console.log('   Email: gestor@vero.com');
    console.log('   Senha: 123456');
    console.log('   Status: APROVADO');
    console.log('');
    console.log('👨‍💻 CONSULTOR:');
    console.log('   Email: consultor@vero.com');
    console.log('   Senha: 123456');
    console.log('   Status: APROVADO');
    console.log('   Fundos: 3 criados (2 aprovados, 1 pendente)');
    console.log('');
    console.log('💰 INVESTIDOR:');
    console.log('   Email: investidor@vero.com');
    console.log('   Senha: 123456');
    console.log('   Status: APROVADO');
    console.log('   Ordens: 2 criadas (1 completa, 1 pendente)');
    console.log('');
    console.log('⏳ USUÁRIOS PENDENTES (para testar aprovação):');
    console.log('   consultor.pendente@vero.com - 123456');
    console.log('   investidor.pendente@vero.com - 123456');
    console.log('');
    console.log('💡 DADOS CRIADOS:');
    console.log('   - 3 fundos com cedentes/sacados específicos');
    console.log('   - Recebíveis de exemplo');
    console.log('   - Ordens de investimento');
    console.log('   - Todos os status de aprovação');
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();