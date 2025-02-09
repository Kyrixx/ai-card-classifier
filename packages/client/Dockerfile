FROM caddy:2

WORKDIR /usr/src/app

COPY Caddyfile .
COPY dist dist

EXPOSE 8081

CMD ["caddy", "run", "--config", "Caddyfile"]
