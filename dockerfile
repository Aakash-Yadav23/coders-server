FROM node:latest



WORKDIR /app

COPY . .

RUN npm i -g pnpm

RUN npm i -g typescript



RUN pnpm install


EXPOSE 3000


CMD [ "pnpm","start" ]
