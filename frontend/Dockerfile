FROM node:20-bullseye-slim as base

FROM base as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install all dependencies including devDependencies
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

FROM base as production

WORKDIR /app

# Copy the standalone directory contents to the root
COPY --from=builder /app/.next/standalone ./
# Copy static files to the correct location
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

EXPOSE 3000

# Update the path to server.js since we copied standalone contents to root
CMD ["node", "server.js"]

