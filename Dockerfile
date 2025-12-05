FROM node:18-bullseye

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

WORKDIR /app

# Install deps separately for better caching; lockfile is optional for now.
COPY package.json ./
RUN pnpm install --ignore-scripts

# Source is mounted via docker-compose for live updates.
CMD ["pnpm", "dev"]
