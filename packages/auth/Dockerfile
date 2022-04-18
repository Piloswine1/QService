FROM rust:alpine as builder
WORKDIR /usr/src/auth

RUN apk add --no-cache cmake

COPY . .
RUN cargo install --path .

FROM alpine:latest
COPY --from=builder /usr/local/cargo/bin/auth /usr/local/bin/auth
EXPOSE 50051
CMD ["auth"]