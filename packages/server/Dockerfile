FROM denoland/deno:1.20.6

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .
RUN deno cache app.ts

EXPOSE 8888
CMD ["run", "--allow-all", "app.ts"]