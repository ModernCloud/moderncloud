FROM alpine:3.13.5
MAINTAINER ModernCloud <contact@moderncloud.io>
RUN mkdir /runner
WORKDIR /runner
COPY typescript-language-server /runner/typescript-language-server
COPY startserver.js /runner
COPY package.json /runner
RUN apk add --no-cache nodejs npm
RUN npm config set package-lock false
RUN npm install --no-fund --no-audit --prod --no-optional -g typescript
RUN npm install --no-fund --no-audit --prod --no-optional --prefix /runner