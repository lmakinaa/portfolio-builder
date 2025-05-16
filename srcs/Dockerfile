# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency files first (caching layer)
COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the project
COPY . .

# Build Next.js and Prisma
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/middleware.ts ./

# Expose and run
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate dev --name init && npx prisma migrate deploy && npm run dev"]