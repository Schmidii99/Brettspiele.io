FROM node:lts-alpine

WORKDIR /app
COPY ../frontend/package*.json ./
RUN npm ci
COPY ../frontend/ .
RUN npm run build

FROM nginx:1.21.6
COPY --from=0 /app/dist /app/dist
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/certs/floslabs.de.key /etc/nginx/certs/floslabs.de.key
COPY ./nginx/certs/floslabs.de.pem /etc/nginx/certs/floslabs.de.pem

EXPOSE 80
EXPOSE 443
