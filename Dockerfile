# Étape 1 : Build Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Étape 2 : Serveur Nginx
FROM nginx:stable-alpine
# Attention : vérifie dans ton angular.json si le dossier de sortie est bien "app-front" ou un autre nom
COPY --from=build /app/dist/app-front/browser /usr/share/nginx/html
# Copie la configuration Nginx (pour gérer le routage Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
