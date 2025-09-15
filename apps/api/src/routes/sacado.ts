import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const createSacadoSchema = z.object({
  name: z.string().min(1),
  document: z.string().min(11),
  address: z.string().optional(),
  publicKey: z.string().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'])
});

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function sacadoRoutes(fastify: FastifyInstance) {
  // Create sacado (Consultor only)
  fastify.post('/', async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return reply.status(401).send({ error: 'No token provided' });
      }

      const payload = verifyToken(token);
      if (payload.role !== 'CONSULTOR') {
        return reply.status(403).send({ error: 'Only consultors can create sacados' });
      }

      const body = createSacadoSchema.parse(request.body);

      const sacado = await fastify.prisma.sacado.create({
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

      return { sacado };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // List sacados (Gestor sees all, Consultor sees own)
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

      const sacados = await fastify.prisma.sacado.findMany({
        where,
        include: {
          consultor: {
            select: { email: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return { sacados };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Update sacado status (Gestor only)
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

      const { id } = request.params as { id: string };
      const body = updateStatusSchema.parse(request.body);

      const sacado = await fastify.prisma.sacado.update({
        where: { id },
        data: { status: body.status },
        include: {
          consultor: {
            select: { email: true, role: true }
          }
        }
      });

      return { sacado };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}