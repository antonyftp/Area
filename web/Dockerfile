FROM node:lts

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn global add serve

COPY . .
RUN yarn build
EXPOSE 3000

CMD mv /apk/app.apk ./build/client.apk && serve -s build
