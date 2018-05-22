FROM node:8.11.1-slim

RUN apt-get update \
  && apt-get install -y git autoconf libpng-dev \
  && npm i -g yarn

COPY .babelrc .eslintrc.js package.json yarn.lock ./
RUN yarn install

COPY webpack.config.js ./
COPY src src

RUN npm run build:demo && npm run build:backend

CMD ["npm", "run", "start:backend"]

HEALTHCHECK CMD curl -sSf http://127.0.0.1:3000/status > /dev/null

EXPOSE 3000