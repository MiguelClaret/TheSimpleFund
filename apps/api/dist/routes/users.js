import { z } from 'zod';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const approvalSchema = z.object({
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
export async function userRoutes(fastify) {
    // Get consultores (only for gestores)
    fastify.get('/consultores', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const user = verifyToken(token);
            if (user.role !== 'GESTOR') {
                return reply.status(403).send({ error: 'Access denied' });
            }
            const consultores = await fastify.prisma.user.findMany({
                where: { role: 'CONSULTOR' },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return { consultores };
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // Approve/reject consultor
    fastify.patch('/:id/approval', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const user = verifyToken(token);
            const params = request.params;
            if (user.role !== 'GESTOR') {
                return reply.status(403).send({ error: 'Access denied' });
            }
            const body = approvalSchema.parse(request.body);
            const consultor = await fastify.prisma.user.findUnique({
                where: { id: params.id, role: 'CONSULTOR' }
            });
            if (!consultor) {
                return reply.status(404).send({ error: 'Consultor not found' });
            }
            const updatedUser = await fastify.prisma.user.update({
                where: { id: params.id },
                data: { status: body.status },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true
                }
            });
            return { user: updatedUser };
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
//# sourceMappingURL=users.js.map