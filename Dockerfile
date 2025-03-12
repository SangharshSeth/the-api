FROM node:22-alpine

WORKDIR /src

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY . .

RUN chown -R appuser:appgroup /src

USER appuser

EXPOSE 8080

CMD ["pnpm", "start"]

