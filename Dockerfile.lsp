FROM node:14.16.0-alpine3.10
MAINTAINER Modern Cloud <contact@moderncloud.io>
RUN apk add --no-cache docker && \
    npm config set package-lock false && \
    npm install -g pm2