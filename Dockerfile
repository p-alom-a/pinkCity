FROM node:20-alpine

# Définir le répertoire de travail principal
WORKDIR /app

# Installer pnpm globalement
RUN npm install -g pnpm

# ========== FRONTEND ==========
WORKDIR /app/client
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY client/ ./
RUN NODE_OPTIONS="--max_old_space_size=1024" pnpm run build

# ========== BACKEND ==========
WORKDIR /app/server
COPY server/package.json server/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY server/ ./

# Copier le build front dans le dossier du back (pour express.static)
RUN cp -r /app/client/dist ./client-dist

# Final setup
WORKDIR /app/server

# Exposer le port utilisé par Express
EXPOSE 8080

# Lancer l'application
CMD ["pnpm", "start"] 