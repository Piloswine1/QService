FROM rust:buster as builder
WORKDIR /usr/src/auth

RUN apt update && apt -y install cmake

COPY . .
RUN cargo install --path .

FROM debian:buster-slim
COPY --from=builder /usr/local/cargo/bin/auth /usr/local/bin/auth
EXPOSE 50051
CMD ["auth"]