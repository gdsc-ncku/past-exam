FROM node:20-bullseye-slim as base

ENV NODE_ENV=production

FROM base as builder

WORKDIR /app

# Set to development during build
ENV NODE_ENV=development

COPY package.json pnpm-lock.yaml ./

# Install all dependencies including devDependencies
RUN npm install -g pnpm && pnpm install

COPY . .

# Set back to production for the build
ENV NODE_ENV=production

RUN pnpm build


FROM base as production

WORKDIR /app

COPY --from=builder /app/.next ./.next

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]

