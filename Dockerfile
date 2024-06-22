FROM node:20.10.0-alpine
WORKDIR /app
COPY package*.json ./

# Add support for https on wget
RUN apk update && apk add --no-cache wget && apk --no-cache add openssl wget && apk add ca-certificates && update-ca-certificates

# Add phantomjs
RUN wget -qO- "https://github.com/fgrehm/docker-phantomjs2/releases/download/v2.0.0-20150722/dockerized-phantomjs.tar.gz" | tar xz -C / \
    && npm install -g phantomjs-prebuilt --force

# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation && rm -rf /var/cache/apk/*

# see this: https://github.com/marcbachmann/node-html-pdf/issues/563#issuecomment-712852134
RUN echo "" > /tmp/openssl.cnf

RUN npm install

COPY . .

RUN npx prisma generate

CMD [ "node", "server.js" ]