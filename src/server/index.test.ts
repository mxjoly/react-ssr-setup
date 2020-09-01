import http from 'http';
import request from 'supertest';
import { Express } from 'express';

const PORT = Number(process.env.PORT) | 3500;

describe('[Server] Root', () => {
  let server: http.Server;

  beforeEach((done) => {
    // To test always a clean server without any residue from the previous unit tests
    delete require.cache[require.resolve('./index')];
    const express: Express = require('./index').default;
    server = express.listen(PORT, done);
  });

  afterEach((done) => {
    server.close(done);
  });

  // ---------------------------------------------------- //

  it('should respond to GET / with status 200', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
  });

  it('should send an error an unknow request', async () => {
    const res = await request(server).post('/');
    expect(res.status).toBe(404);
  });
});
