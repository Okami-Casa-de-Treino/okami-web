FROM oven/bun:1.0.25 as builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN bun install
RUN bun run build