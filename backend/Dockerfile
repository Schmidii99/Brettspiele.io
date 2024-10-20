FROM denoland/deno:2.0.2

WORKDIR /app

COPY . .
RUN deno cache main.ts

USER deno
EXPOSE 8080

CMD ["run", "--allow-net", "--allow-env", "main.ts"]