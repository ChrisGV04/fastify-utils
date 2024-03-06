import type { FastifySchemaCompiler } from 'fastify';
import type { AnyZodObject } from 'zod';
import { SchemaValidationError } from '../errors';

/** Custom validator compiler that allows Zod to validate Fastify route schemas */
export const zodValidatorCompiler: FastifySchemaCompiler<AnyZodObject> = ({ schema }) => {
  return (data) => {
    const result = schema.safeParse(data);
    if (!result.success) return { error: new SchemaValidationError(result.error) };
    return { value: result.data };
  };
};
