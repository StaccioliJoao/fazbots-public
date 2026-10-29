# Debian image because the `canvas` package needs Cairo/Pango system libraries.
FROM node:18-bullseye-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential python3 \
      libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN mkdir -p data

CMD ["npm", "start"]
