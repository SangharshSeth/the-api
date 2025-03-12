import express, { urlencoded, json } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import { logger } from './middlewares.mjs';
import { fibonacci, fibonaciiSolver } from './fibonacii-worker.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT=process.env.PORT;

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: "*"
}))

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health-check', (_req, res) => {
    res.status(200).send('OK');
})


app.get('/fibonacci/:number', async (req, res) => {
    try {
        const n = Number(req.params.number);

        // Single-threaded execution
        const start_single_threaded = process.hrtime();
        const result_single = fibonaciiSolver(n);
        const [seconds1, nanoseconds1] = process.hrtime(start_single_threaded);

        // Worker-threaded execution
        const start_worker_threaded = process.hrtime();
        const result_worker = await fibonacci(n);
        const [seconds2, nanoseconds2] = process.hrtime(start_worker_threaded);

        return res.status(200).json({
            single_threaded: {
                result: result_single,
                computation_time: `${seconds1}s ${Math.round(nanoseconds1 / 1000000)}ms`
            },
            worker_threaded: {
                result: result_worker,
                computation_time: `${seconds2}s ${Math.round(nanoseconds2 / 1000000)}ms`
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);

})

process.on('uncaughtException', (error, origin) => {
    //simulate graceful shutdown
    console.log(`uncaughtexception ${error} at ${origin}`);
    process.exit(0);
})

process.on('unhandledRejection', (reason, promise) => {
    console.log(`rejected due to ${reason} at ${promise}`);
    process.exit(0);
})

export { app }