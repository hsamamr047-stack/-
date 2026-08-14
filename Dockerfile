# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci || npm install

# Copy source code
COPY . .

# Build Vite frontend static bundle and bundled esbuild server.cjs
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install production dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy built production output from builder
COPY --from=builder /app/dist ./dist

# Expose container port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
