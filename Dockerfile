FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY entrypoint.sh ./

RUN npm install

RUN chmod +x ./entrypoint.sh

COPY . .

EXPOSE 3000