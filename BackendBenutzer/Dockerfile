# syntax=docker/dockerfile:1
FROM node:17-alpine
ENV NODE_ENV=production HOST=:: MONGODB=mongodb://mongodb:27016
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
EXPOSE 3001/tcp
ENTRYPOINT ["node", "src/index.js"]
