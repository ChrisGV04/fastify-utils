import type { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError, UnknownError } from './errors';

export function errorHandler(error: any, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof CustomError) {
    return reply.status(error.statusCode).send({ error: error.serializeError() });
  }

  request.log.error('Unknown error:', error);
  reply
    .status(500)
    .send(
      new UnknownError(
        'Error desconocido',
        error.message ? `Detalles: ${error.message}` : undefined,
      ).serializeError(),
    );
}
