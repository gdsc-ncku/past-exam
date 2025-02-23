FROM golang:1.23 AS builder

WORKDIR /app


COPY go.mod go.sum ./
RUN go mod tidy


COPY . .

RUN go build -o main .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

RUN apk add libc6-compat

EXPOSE 8080

CMD ["./main"]


