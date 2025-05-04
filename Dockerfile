FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install

RUN npm run build

FROM node:22-alpine AS runner

RUN apk --no-cache add dumb-init

WORKDIR /app

COPY --from=builder /app ./dist

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "app.js"]
