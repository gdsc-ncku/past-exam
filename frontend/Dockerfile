FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Enable corepack and install the specific pnpm version
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

RUN pnpm install

COPY . .

RUN pnpm build

FROM base AS production

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
