# front :
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
# Copier le build Angular
COPY --from=build /app/dist/app-front/browser /usr/share/nginx/html
# NOUVEAU : Copier la configuration Nginx pour gérer les routes de l'application
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
