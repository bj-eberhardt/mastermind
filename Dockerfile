FROM node:20.11.1-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Ergebnis liegt dann in /app/dist