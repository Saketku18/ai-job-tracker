# ===============================
# Backend Dockerfile
# ===============================

FROM node:18-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

RUN npm install

# Copy rest of the code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]