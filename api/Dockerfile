FROM node:18-alpine

# ติดตั้ง bash, netcat และ curl สำหรับ healthcheck
RUN apk add --no-cache bash netcat-openbsd curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# สร้าง wait-for-it script
RUN echo '#!/bin/sh' > /wait-for-it.sh && \
    echo 'set -e' >> /wait-for-it.sh && \
    echo 'host="$1"' >> /wait-for-it.sh && \
    echo 'shift' >> /wait-for-it.sh && \
    echo 'port="$1"' >> /wait-for-it.sh && \
    echo 'shift' >> /wait-for-it.sh && \
    echo 'until nc -z "$host" "$port"; do' >> /wait-for-it.sh && \
    echo '  echo "Waiting for $host:$port..."' >> /wait-for-it.sh && \
    echo '  sleep 2' >> /wait-for-it.sh && \
    echo 'done' >> /wait-for-it.sh && \
    echo 'echo "$host:$port is available!"' >> /wait-for-it.sh && \
    echo 'exec "$@"' >> /wait-for-it.sh && \
    chmod +x /wait-for-it.sh

EXPOSE 3001

# รอ MySQL แล้วค่อยเริ่ม
CMD ["/wait-for-it.sh", "mysql", "3306", "node", "index.js"]