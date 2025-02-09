FROM node:22-alpine

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/certs
RUN mkdir -p /usr/src/app/assets

COPY package.json .
COPY node_modules/ node_modules/
COPY dist/ .

CMD ["node", "main.js"]
