import http from 'http';
import request from 'supertest';
import { Express } from 'express';

const PORT = Number(process.env.PORT) | 3500;
const OLD_ENV = process.env;

describe('App router', () => {
  let server: http.Server;

  describe('Common website', () => {
    beforeEach(async () => {
      process.env = { ...OLD_ENV, PWA: 'false' };
      const express: Express = require('.').default;
      server = await express.listen(PORT);
    });

    afterEach(async () => {
      await server.close();
      jest.resetModules(); // To test always a clean server without any residue from the previous unit tests
      process.env = OLD_ENV; // restore old env
    });

    it('GET / responds with an html content type', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
    });

    it('GET / locales/:locale/:ns.json returns the translations as a json', async () => {
      const res = await request(server).get('/locales/en/common.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });
  });

  // ================================================================ //

  describe('Progressive web application', () => {
    beforeEach(async () => {
      process.env = { ...OLD_ENV, PWA: 'true' };
      const express: Express = require('.').default;
      server = await express.listen(PORT);
    });

    afterEach(async () => {
      await server.close();
      jest.resetModules(); // To test always a clean server without any residue from the previous unit tests
      process.env = OLD_ENV; // restore old env
    });

    it('GET / responds with an html content type', async () => {
      const res = await request(server).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
    });

    it('GET / locales/:locale/:ns.json returns the translations as a json', async () => {
      const res = await request(server).get('/locales/en/common.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });
  });
});
