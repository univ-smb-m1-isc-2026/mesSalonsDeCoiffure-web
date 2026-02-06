FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
# Angular build souvent dans dist/[nom-du-projet]/browser
COPY --from=build /app/dist/app-front/browser /usr/share/nginx/html
EXPOSE 80
