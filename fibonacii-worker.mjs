import { fileURLToPath } from 'url';
import path from 'node:path';
import { Worker, parentPort, isMainThread, workerData } from 'node:worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function fibonacci(n) {
    if(isMainThread) {
        return new Promise((resolve, reject) => {
            const result = [];
            
            const worker_1 = new Worker(path.join(__dirname, 'fibonacii-worker.mjs'), {
                workerData: { num: n - 1 }
            });
            const worker_2 = new Worker(path.join(__dirname, 'fibonacii-worker.mjs'), {
                workerData: { num: n - 2 }
            });

            worker_1.on('message', (data) => {
                result.push(data);
                if(result.length === 2) {
                    resolve(result.reduce((prev, cur) => prev + cur, 0));
                }
            });

            worker_2.on('message', (data) => {
                result.push(data);
                if(result.length === 2) {
                    resolve(result.reduce((prev, cur) => prev + cur, 0));
                }
            });

            worker_1.on('error', reject);
            worker_2.on('error', reject);
        });
    } else {
        const result = fibonaciiSolver(workerData.num);
        parentPort.postMessage(result);
    }
}

export function fibonaciiSolver(num) {
    if (num <= 1) return num;
    return fibonaciiSolver(num - 1) + fibonaciiSolver(num - 2);
}

// Add this to handle worker execution
if (!isMainThread) {
    const result = fibonaciiSolver(workerData.num);
    parentPort.postMessage(result);
    parentPort.close();
}