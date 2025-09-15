import { z } from 'zod';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const createReceivableSchema = z.object({
    fundId: z.string(),
    sacadoId: z.string(),
    faceValue: z.number().positive(),
    dueDate: z.string().datetime()
});
const markPaidSchema = z.object({
    paidValue: z.number().positive()
});
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        throw new Error('Invalid token');
    }
}
export async function receivableRoutes(fastify) {
    // Create receivable (Gestor only)
    fastify.post('/', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = verifyToken(token);
            if (payload.role !== 'GESTOR') {
                return reply.status(403).send({ error: 'Only gestors can create receivables' });
            }
            const body = createReceivableSchema.parse(request.body);
            const receivable = await fastify.prisma.receivable.create({
                data: {
                    ...body,
                    dueDate: new Date(body.dueDate)
                },
                include: {
                    fund: {
                        select: { name: true, symbol: true }
                    },
                    sacado: {
                        select: { name: true, document: true }
                    }
                }
            });
            return { receivable };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // List receivables
    fastify.get('/', async (request, reply) => {
        try {
            const receivables = await fastify.prisma.receivable.findMany({
                include: {
                    fund: {
                        select: { name: true, symbol: true }
                    },
                    sacado: {
                        select: { name: true, document: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return { receivables };
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // Mark receivable as paid (Gestor only)
    fastify.patch('/:id/mark-paid', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = verifyToken(token);
            if (payload.role !== 'GESTOR') {
                return reply.status(403).send({ error: 'Only gestors can mark as paid' });
            }
            const { id } = request.params;
            const body = markPaidSchema.parse(request.body);
            const receivable = await fastify.prisma.receivable.update({
                where: { id },
                data: {
                    status: 'PAID',
                    paidValue: body.paidValue,
                    paidAt: new Date()
                },
                include: {
                    fund: {
                        select: { name: true, symbol: true }
                    },
                    sacado: {
                        select: { name: true, document: true }
                    }
                }
            });
            return { receivable };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // Distribute receivable payment (Gestor only)
    fastify.post('/:id/distribute', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = verifyToken(token);
            if (payload.role !== 'GESTOR') {
                return reply.status(403).send({ error: 'Only gestors can distribute' });
            }
            const { id } = request.params;
            const receivable = await fastify.prisma.receivable.findUnique({
                where: { id },
                include: {
                    fund: {
                        include: {
                            orders: {
                                where: { status: 'COMPLETED' },
                                include: {
                                    investor: {
                                        select: { publicKey: true, email: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (!receivable) {
                return reply.status(404).send({ error: 'Receivable not found' });
            }
            if (receivable.status !== 'PAID') {
                return reply.status(400).send({ error: 'Receivable must be paid first' });
            }
            // Calculate pro-rata distribution
            const totalQuotas = receivable.fund.orders.reduce((sum, order) => sum + order.quantity, 0);
            const totalToPay = receivable.paidValue || 0;
            const distributions = receivable.fund.orders.map((order) => ({
                investorPublicKey: order.investor.publicKey,
                investorEmail: order.investor.email,
                quotas: order.quantity,
                amount: (order.quantity / totalQuotas) * totalToPay
            }));
            // Update receivable status
            await fastify.prisma.receivable.update({
                where: { id },
                data: { status: 'DISTRIBUTED' }
            });
            return {
                receivable,
                distributions,
                totalQuotas,
                totalToPay
            };
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
//# sourceMappingURL=receivable.js.map