import { strict as assert } from 'assert';
import http from 'http';
import { app } from '../index.mjs';

describe('Health Check API', () => {
    let server;

    before((done) => {
        server = app.listen(8081, done);
    });

    after((done) => {
        server.close(() => {
            // Force close any remaining connections
            process.removeAllListeners();
            done();
        });
    });

    it('should return 200 OK', (done) => {
        http.get('http://localhost:8081/health-check', (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                assert