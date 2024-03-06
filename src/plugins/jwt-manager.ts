import type { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyInstance {
    /**
     * Generates both the user access token and refresh token
     * @param userId The ID of the user to include in the payload of the token
     * @returns The access token for the user
     */
    generateAccessToken: (userId: string) => string;

    /**
     * Method that verifies if an access token is valid and returns the info inside the token
     * @param token An access token for a user
     * @returns An object with the `uid` contained in the token
     */
    verifyUserToken: (token: string) => { uid: string };

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
  app.decorate('generateAccessToken', (uid: string) => {
    const token = jwt.sign({ uid }, options.secret, { expiresIn: '5m' });
    return token;
  });

  app.decorate('verifyUserToken', (token: string) => {
    return jwt.verify(token, options.secret) as { uid: string };
  });

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
