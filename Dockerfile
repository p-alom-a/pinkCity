# Étape 1 : Build du frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package.json client/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY client/ ./
RUN NODE_OPTIONS="--max_old_space_size=1024" pnpm run build

# Étape 2 : Build du backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package.json server/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY server/ ./

# Étape finale : image de production
FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

# Copier le build du front et le dossier client complet
COPY --from=frontend-builder /app/client/dist /app/client/dist
COPY client /app/client

# Copier le code du back
COPY --from=backend-builder /app/server /app/server

WORKDIR /app/server

EXPOSE 8080

CMD ["pnpm", "start"]
