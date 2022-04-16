FROM rust:buster as builder
WORKDIR /usr/src/auth
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
COPY --from=builder /usr/local/cargo/bin/auth /usr/local/bin/auth
EXPOSE 50051
CMD ["auth"]