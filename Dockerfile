# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine

# Copy static build
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default config with SPA-aware config on port 3000
RUN rm -f /etc/nginx/conf.d/default.conf
COPY <<'EOF' /etc/nginx/conf.d/app.conf
server {
    listen       3000;
    server_name  _;

    root   /usr/share/nginx/html;
    index  index.html;

    # Cache static assets (hashed filenames)
    location ~* \.(css|js|mjs|png|jpg|jpeg|gif|svg|webp|ico|json|txt|woff2?)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # SPA fallback
    location / {
        try_files $uri /index.html;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript application/xml+rss application/xml text/javascript image/svg+xml;
    gzip_min_length 1024;
}
EOF

EXPOSE 3000

# Optional healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1