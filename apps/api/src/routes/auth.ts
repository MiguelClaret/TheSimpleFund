import { FastifyInstance } from 'fastify';
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
  role: z.enum(['CONSULTOR', 'INVESTIDOR']) // Removed GESTOR - can only be created by backoffice
});

export async function authRoutes(fastify: FastifyInstance) {
  // Endpoint de teste simples
  fastify.get('/test-simple', async () => {
    return { message: 'Funcionou!' };
  });

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

      // All users need approval from manager (GESTOR)
      const initialStatus = 'PENDING';

      // Create user
      const user = await fastify.prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          role: body.role,
          status: initialStatus
        },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          publicKey: true,
          createdAt: true
        }
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { user, token };
    } catch (error) {
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

      // Check if user is approved (all users need approval except GESTOR)
      if (user.role !== 'GESTOR' && user.status !== 'APPROVED') {
        const roleText = user.role === 'CONSULTOR' ? 'consultant' : 'investor';
        return reply.status(403).send({ 
          error: 'Account pending approval', 
          message: `Your ${roleText} account is pending approval by a manager.`
        });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;

      return { user: userWithoutPassword, token };
    } catch (error) {
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

      const payload = jwt.verify(token, JWT_SECRET) as any;
      const { publicKey, secretKey } = z.object({ 
        publicKey: z.string(),
        secretKey: z.string().optional()
      }).parse(request.body);

      const user = await fastify.prisma.user.update({
        where: { id: payload.id },
        data: { 
          publicKey,
          ...(secretKey && { secretKey })
        },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          publicKey: true,
          createdAt: true
        }
      });

      return { user };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get current user data
  fastify.get('/me', async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return reply.status(401).send({ error: 'No token provided' });
      }

      const payload = jwt.verify(token, JWT_SECRET) as any;
      
      const user = await fastify.prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          publicKey: true,
          createdAt: true
        }
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return { user };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}