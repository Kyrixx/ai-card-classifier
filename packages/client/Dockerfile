FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY . ./
RUN npm install
RUN npm run build


FROM caddy:2

WORKDIR /usr/src/app

ENV CERT_PATH=../../certs/server.crt
ENV KEY_PATH=../../certs/server.key

COPY Caddyfile .
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8081

CMD ["caddy", "run", "--config", "Caddyfile"]
