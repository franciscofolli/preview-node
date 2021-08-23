FROM node:14.17.5

LABEL maintainer "Francisco Folli <franciscoabel2001@gmail.com>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install && \
npm rebuild bcrypt

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start.dev"]
