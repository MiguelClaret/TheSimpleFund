import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['CONSULTOR', 'GESTOR', 'INVESTIDOR'])
});
export async function authRoutes(fastify) {
    // Register
    fastify.post('/register', async (request, reply) => {
        try {
            const body = registerSchema.parse(request.body);
            // Check if user already exists
            const existingUser = await fastify.prisma.user.findUnique({
                where: { email: body.email }
            });
            if (existingUser) {
                return reply.status(400).send({ error: 'Email already registered' });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(body.password, 10);
            // Create user
            const user = await fastify.prisma.user.create({
                data: {
                    email: body.email,
                    password: hashedPassword,
                    role: body.role
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    publicKey: true,
                    createdAt: true
                }
            });
            // Generate JWT
            const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
            return { user, token };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // Login
    fastify.post('/login', async (request, reply) => {
        try {
            const body = loginSchema.parse(request.body);
            // Find user
            const user = await fastify.prisma.user.findUnique({
                where: { email: body.email }
            });
            if (!user) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }
            // Check password
            const isValid = await bcrypt.compare(body.password, user.password);
            if (!isValid) {
                return reply.status(401).send({ error: 'Invalid credentials' });
            }
            // Generate JWT
            const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
            const { password: _, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, token };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ error: 'Invalid input', details: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
    // Update Stellar public key
    fastify.post('/stellar-key', async (request, reply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return reply.status(401).send({ error: 'No token provided' });
            }
            const payload = jwt.verify(token, JWT_SECRET);
            const { publicKey, secretKey } = z.object({
                publicKey: z.string(),
                secretKey: z.string().optional()
            }).parse(request.body);
            const user = await fastify.prisma.user.update({
                where: { id: payload.userId },
                data: {
                    publicKey,
                    ...(secretKey && { secretKey })
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    publicKey: true,
                    createdAt: true
                }
            });
            return { user };
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
//# sourceMappingURL=auth.js.map