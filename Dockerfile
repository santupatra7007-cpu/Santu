# Debian-based image (the yt-dlp binary needs glibc — it does NOT run on node:alpine)
FROM node:20-bookworm-slim

# ffmpeg  → mp3 conversion for .song / .tomp3 / .vnote / .setmsong
# python3 → required by yt-dlp
# curl    → to fetch the latest yt-dlp release
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg python3 curl ca-certificates git \
 && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
 && chmod a+rx /usr/local/bin/yt-dlp \
 && rm -rf /var/lib/apt/lists/*

ENV YT_DLP_PATH=/usr/local/bin/yt-dlp
# song download / AI image can take longer than the default 60s command timeout
ENV CMD_TASK_TIMEOUT_MS=180000

WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm install --omit=dev

# Copy all bot files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
