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
                assert.strictEqual(res.statusCode, 200);
                assert.strictEqual(data, 'OK');
                done();
            });
        }).on('error', done);
    });
});

describe('Fibonacci API', () => {
    let server;

    before(() => {
        server = app.listen(8082);
    });

    after((done) => {
        server.close(() => {
            process.exit(0);
            done();
        });
    });
    

    it('should return correct fibonacci results with computation times', (done) => {
        http.get('http://localhost:8082/fibonacci/10', (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                
                // Check response structure
                assert.ok(response.single_threaded);
                assert.ok(response.worker_threaded);
                
                // Check result values
                assert.strictEqual(response.single_threaded.result, 55);
                assert.strictEqual(response.worker_threaded.result, 55);
                
                // Check computation time format
                assert.match(response.single_threaded.computation_time, /^\d+s \d+ms$/);
                assert.match(response.worker_threaded.computation_time, /^\d+s \d+ms$/);
                
                // Check status code
                assert.strictEqual(res.statusCode, 200);
                done();
            });
        });
    });

    it('should handle invalid input', (done) => {
        http.get('http://localhost:8082/fibonacci/invalid', (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                assert.strictEqual(res.statusCode, 500);
                assert.ok(response.error);
                done();
            });
        });
    });
});





