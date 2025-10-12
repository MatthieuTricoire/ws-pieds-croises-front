# Stage 1: Build Angular
FROM node:18 AS builder

# Argument pour définir l'environnement (par défaut: production)
ARG BUILD_CONFIG=production

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Utiliser l'argument pour le build
RUN npm run build -- --configuration ${BUILD_CONFIG}

# Stage 2: Servir avec Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/pieds-croises-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
