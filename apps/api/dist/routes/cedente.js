import { z } from 'zod';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const createCedenteSchema = z.object({
    name: z.string().min(1),
    document: z.string().min(11),
    address: z.string().optional(),
    publicKey: z.string().optional()
});
const updateStatusSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED'])
});
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        throw new Error('Invalid token');
    }
}
export async function cedenteRoutes(fastify) {
    // Create cedente (Consultor only)
    fastify.post('/', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = verifyToken(token);
            if (payload.role !== 'CONSULTOR') {
                return reply.status(403).send({ error: 'Only consultors can create cedentes' });
            }
            const body = createCedenteSchema.parse(request.body);
            const cedente = await fastify.prisma.cedente.create({
                data: {
                    ...body,
                    consultorId: payload.userId
                },
                include: {
                    consultor: {
                        select: { email: true, role: true }
                    }
                }
            });
            return { cedente };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // List cedentes (Gestor sees all, Consultor sees own)
    fastify.get('/', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = verifyToken(token);
            const where = payload.role === 'CONSULTOR'
                ? { consultorId: payload.userId }
                : {};
            const cedentes = await fastify.prisma.cedente.findMany({
                where,
                include: {
                    consultor: {
                        select: { email: true, role: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return { cedentes };
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // Update cedente status (Gestor only)
    fastify.patch('/:id/status', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = verifyToken(token);
            if (payload.role !== 'GESTOR') {
                return reply.status(403).send({ error: 'Only gestors can update status' });
            }
            const { id } = request.params;
            const body = updateStatusSchema.parse(request.body);
            const cedente = await fastify.prisma.cedente.update({
                where: { id },
                data: { status: body.status },
                include: {
                    consultor: {
                        select: { email: true, role: true }
                    }
                }
            });
            return { cedente };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
//# sourceMappingURL=cedente.js.map