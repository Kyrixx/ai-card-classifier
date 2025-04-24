FROM node:23-alpine AS builder

WORKDIR /usr/src/app
COPY . ./
RUN npm install
RUN npm run build



FROM node:23-alpine

WORKDIR /usr/src/app

RUN apk add ffmpeg

RUN mkdir -p /usr/src/app/certs
RUN mkdir -p /usr/src/app/assets

COPY package.json .
COPY src/worker.js ./worker.js
COPY assets/ ./assets/
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist .

RUN node setup.js -y

CMD ["node", "main.js"]
