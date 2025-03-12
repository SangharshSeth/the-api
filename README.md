# Express Fibonacci API

A Node.js API demonstrating parallel computing using Worker Threads to calculate Fibonacci numbers.

## Features

- Health check endpoint
- Fibonacci calculation with performance comparison
- Single-threaded vs Worker Thread implementation
- Docker support
- Unit testing with Mocha

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm package manager
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
pnpm install
```

### Running the API

```bash
# Development
pnpm start

# With Docker
docker build -t fibonacci-api .
docker run -p 8080:8080 fibonacci-api
```

## API Documentation

### Health Check

```http
GET /health-check
```

**Response**
```json
"OK"
```

### Calculate Fibonacci

```http
GET /fibonacci/:number
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `number` | `integer` | **Required**. Number to calculate Fibonacci |

**Response**
```json
{
    "single_threaded": {
        "result": 55,
        "computation_time": "0s 123ms"
    },
    "worker_threaded": {
        "result": 55,
        "computation_time": "0s 98ms"
    }
}
```

## Testing

```bash
# Run tests
pnpm test
```

## Project Structure

```
api/
├── index.mjs           # Express app setup
├── middlewares.mjs     # Custom middlewares
├── fibonacii-worker.mjs# Worker thread implementation
├── test/              # Test files
├── Dockerfile         # Docker configuration
└── package.json      # Project dependencies
```

## Performance Comparison

The API calculates Fibonacci numbers using two methods:
1. Single-threaded recursive calculation
2. Parallel calculation using Worker Threads

For large numbers (n > 35), the worker thread implementation shows significant performance benefits.

## Environment Variables

| Variable | Default | Description           |
| :------- | :------ | :-------------------- |
| `PORT`   | `8080`  | API server port      |

## Docker Support

The API includes a Dockerfile for containerized deployment:
- Base image: `node:22-alpine`
- Production dependencies only
- Non-root user execution
- Exposed port: 8080

## License

ISC