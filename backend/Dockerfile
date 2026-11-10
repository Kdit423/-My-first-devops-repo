# ---------- Этап 1: сборка ----------
# Образ с компилятором Go. В финальный образ он НЕ попадёт.
FROM golang:1.22-alpine AS builder

WORKDIR /build

# Сначала копируем только файлы зависимостей: пока они не меняются,
# слой с go mod download берётся из кэша и сборка идёт за секунды.
COPY go.mod go.sum ./
RUN go mod download

# Теперь исходники и сборка.
COPY . .

# CGO_ENABLED=0: статический бинарник, которому не нужна glibc
# (в distroless/static её нет).
# -ldflags="-s -w": убираем отладочную информацию, бинарник меньше.
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/app ./main.go

# ---------- Этап 2: исполнение ----------
# distroless: нет shell и пакетного менеджера, поверхность атаки минимальна.
# Вариант :nonroot запускает процесс не от root.
FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /app

# Берём из первого этапа только готовый бинарник.
COPY --from=builder /out/app /app/app

# EXPOSE только документирует порт, наружу его пробрасывает Compose.
EXPOSE 8080

# Явно указываем непривилегированного пользователя.
USER nonroot:nonroot

ENTRYPOINT ["/app/app"]
