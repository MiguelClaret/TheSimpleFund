import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const createSacadoSchema = z.object({
  name: z.string().min(1),
  document: z.string().min(11),
  address: z.string().optional(),
  publicKey: z.string().optional(),
  fundId: z.string()
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
  // Create sacado (Consultor only) - now requires fundId
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

      // Verify fund belongs to consultor
      const fund = await fastify.prisma.fund.findFirst({
        where: {
          id: body.fundId,
          consultorId: payload.id
        }
      });

      if (!fund) {
        return reply.status(404).send({ error: 'Fund not found or you do not have permission' });
      }

      const sacado = await fastify.prisma.sacado.create({
        data: {
          name: body.name,
          document: body.document,
          address: body.address,
          publicKey: body.publicKey,
          consultorId: payload.id,
          fundId: body.fundId
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

  // Get sacados by fund
  fastify.get('/fund/:fundId', async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return reply.status(401).send({ error: 'No token provided' });
      }

      const payload = verifyToken(token);
      const { fundId } = request.params as { fundId: string };

      // Verify fund belongs to consultor (if consultor role)
      if (payload.role === 'CONSULTOR') {
        const fund = await fastify.prisma.fund.findFirst({
          where: {
            id: fundId,
            consultorId: payload.id
          }
        });

        if (!fund) {
          return reply.status(404).send({ error: 'Fund not found or you do not have permission' });
        }
      }

      const sacados = await fastify.prisma.sacado.findMany({
        where: { 
          fundId,
          ...(payload.role === 'CONSULTOR' && { consultorId: payload.id })
        },
        include: {
          consultor: {
            select: { email: true, role: true }
          },
          fund: {
            select: { name: true, id: true }
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

  // List all sacados (Gestor sees all, Consultor sees own) - now includes fund info
  fastify.get('/', async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return reply.status(401).send({ error: 'No token provided' });
      }

      const payload = verifyToken(token);

      const where = payload.role === 'CONSULTOR' 
        ? { consultorId: payload.id }
        : {};

      const sacados = await fastify.prisma.sacado.findMany({
        where,
        include: {
          consultor: {
            select: { email: true, role: true }
          },
          fund: {
            select: { name: true, id: true }
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
          },
          fund: {
            select: { name: true, id: true }
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