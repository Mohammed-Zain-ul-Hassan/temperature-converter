# --- Stage 1: Build & Test ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test

# --- Stage 2: Production ---
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.js .
EXPOSE 3000
CMD ["node", "index.js"]