FROM denoland/deno:alpine as builder

WORKDIR /myapp

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache app.ts

EXPOSE 8888
CMD ["run", "--allow-all", "app.ts"]
