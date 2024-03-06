import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyInstance {
    /**
     * Method to convert any payload into a JWT
     * @param payload The content to convert into a JWT
     * @param config The configs to pass to `jwt.sign`
     * @returns The JWT token as a string
     */
    tokenizeJwt: (payload: any, config?: jwt.SignOptions) => string;

    /**
     * Method that verifies a JWT and returns the payload if it's valid
     * @param token The string version of the JWT token
     * @returns The verified payload from the JWT or `null` if invalid
     */
    verifyJwt: <T = any>(token: string) => T | null;

    /**
     * Decodes any token without verifying its signature
     * @param token Any JWT that you need to decode
     * @returns The info inside the token
     */
    decodeToken: <T = any>(token: string) => T;
  }
}

interface JwtManagerOptions {
  secret: string;
}

const jwtManager: FastifyPluginCallback<JwtManagerOptions> = (app, options, done) => {
  app.decorate('tokenizeJwt', (payload: any, config?: jwt.SignOptions) => {
    const token = jwt.sign(payload, options.secret, config);
    return token;
  });

  app.decorate('verifyJwt', (token: string) => {
    try {
      const payload = jwt.verify(token, options.secret!);
      return payload;
    } catch (error) {
      return null;
    }
  });

  app.decorate('decodeToken', (token: string) => {
    return jwt.decode(token);
  });

  done();
};

export const jwtManagerPlugin = fp(jwtManager, { name: '@cgvweb/jwt-manager', fastify: '4.x' });
