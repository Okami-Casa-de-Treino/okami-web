# Stage 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile
COPY . .
RUN npm run build || yarn build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

# Nginx will serve on port 80 by default, but we expose 3000 for clarity. You can map any host port to 80 in docker run. 