import http from 'http';
import request from 'supertest';
import { Express } from 'express';

const PORT = Number(process.env.PORT) | 3500;
const OLD_ENV = process.env;

describe('App router', () => {
  let server: http.Server;

  beforeEach(async () => {
    process.env = { ...OLD_ENV }; // make a copy
    // To test always a clean server without any residue from the previous unit tests
    delete require.cache[require.resolve('./index')];
    const express: Express = require('./index').default;
    server = await express.listen(PORT);
  });

  afterEach(async () => {
    await server.close();
    process.env = OLD_ENV; // restore old env
  });

  // ---------------------------------------------------- //

  it('GET / responds with an html content type', async () => {
    // test for the common web site
    process.env.PWA = 'false';
    const res1 = await request(server).get('/');
    expect(res1.status).toBe(200);
    expect(res1.headers['content-type']).toContain('text/html');

    // test for the progressive web app
    process.env.PWA = 'true';
    const res2 = await request(server).get('/');
    expect(res2.status).toBe(200);
    expect(res2.headers['content-type']).toContain('text/html');
  });

  it('GET / locales/:locale/:ns.json returns the translations as a json', async () => {
    const res = await request(server).get('/locales/en/common.json');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
  });
});
