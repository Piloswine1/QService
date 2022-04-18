FROM denoland/deno:alpine as builder

WORKDIR /myapp

COPY deps.ts .

COPY . .
RUN deno compile --allow-all app.ts

FROM alpine as runner

COPY --from=builder /myapp/app .

EXPOSE 8888
CMD ["app"]