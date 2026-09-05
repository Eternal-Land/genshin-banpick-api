# Build with Yarn
FROM node:22-alpine AS builder
RUN npm install -g bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM node:22-alpine AS runner
RUN npm install -g bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]