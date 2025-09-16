import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';
import { cedenteRoutes } from './routes/cedente.js';
import { sacadoRoutes } from './routes/sacado.js';
import { fundRoutes } from './routes/fund.js';
import { receivableRoutes } from './routes/receivable.js';
import { orderRoutes } from './routes/order.js';
import { stellarRoutes } from './routes/stellar.js';
const prisma = new PrismaClient();
const fastify = Fastify({
    logger: true
});
// Register CORS
await fastify.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
});
// Make prisma available throughout the app
fastify.decorate('prisma', prisma);
// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(userRoutes, { prefix: '/api/users' });
await fastify.register(cedenteRoutes, { prefix: '/api/cedentes' });
await fastify.register(sacadoRoutes, { prefix: '/api/sacados' });
await fastify.register(fundRoutes, { prefix: '/api/funds' });
await fastify.register(receivableRoutes, { prefix: '/api/receivables' });
await fastify.register(orderRoutes, { prefix: '/api/orders' });
await fastify.register(stellarRoutes, { prefix: '/api/stellar' });
// Health check
fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});
// Graceful shutdown
const gracefulShutdown = async () => {
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
};
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
const start = async () => {
    try {
        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('🚀 Server running on http://localhost:3001');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map