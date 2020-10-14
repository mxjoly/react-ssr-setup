import http from 'http';
import request from 'supertest';
import { Express } from 'express';

const PORT = Number(process.env.PORT) | 3500;

describe('Server', () => {
  let server: http.Server;

  beforeEach(async () => {
    // To test always a clean server without any residue from the previous unit tests
    delete require.cache[require.resolve('.')];
    const express: Express = require('.').default;
    server = express.listen(PORT);
  });

  afterEach(async () => {
    await server.close();
  });

  // ---------------------------------------------------- //

  it('GET / responds with status 200', async () => {
    const res = await request(server).get('/').expect(200);
    expect(res.status).toBe(200);
  });

  it('responds with status 404 for an unknown request', async () => {
    const res = await request(server).post('/');
    expect(res.status).toBe(404);
  });
});
