# Build with Yarn
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY --from=builder /app/dist ./
CMD ["node", "main.js"]