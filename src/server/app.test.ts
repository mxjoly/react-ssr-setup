import http from 'http';
import request from 'supertest';
import { Express } from 'express';

const PORT = Number(process.env.PORT) | 3500;

describe('[Server] App', () => {
  let server: http.Server;

  beforeEach((done) => {
    // To test always a clean server without any residue from the previous unit tests
    delete require.cache[require.resolve('./index')];
    const express: Express = require('./index').default;
    server = express.listen(PORT, done);
  });

  afterEach((done) => {
    jest.clearAllMocks();
    server.close(done);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ---------------------------------------------------- //

  it('GET / should respond with an html content type', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('GET / locales/:locale/:ns.json should return the translations as a json', async () => {
    const res = await request(server).get('/locales/en/common.json');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
  });
});
