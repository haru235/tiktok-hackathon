# Build stage
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM golang:1.23
WORKDIR /app
COPY --from=build-stage /app/dist /app/dist
COPY . .
RUN go mod download
RUN go build -o main .
CMD ["./main"]