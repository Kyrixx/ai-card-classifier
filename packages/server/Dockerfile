FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY . ./

RUN npm install

RUN npm run build

FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add ffmpeg

RUN mkdir -p /usr/src/app/certs
RUN mkdir -p /usr/src/app/assets

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist .

COPY ./src/assets /usr/src/app/src/assets

CMD ["node", "main.js"]
