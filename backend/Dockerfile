FROM denoland/deno:2.0.2

WORKDIR /app

COPY . .

RUN deno cache main.ts
RUN touch ./backend.log
RUN chmod 666 ./backend.log

USER deno
EXPOSE 8080

CMD ["task", "build"]