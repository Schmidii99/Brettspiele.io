FROM node:22-alpine3.19

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

EXPOSE 3000
CMD ["node", "."]
