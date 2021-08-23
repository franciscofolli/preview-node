FROM node:14.17.5

LABEL maintainer "Francisco Folli <franciscoabel2001@gmail.com>"

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install && \
npm rebuild bcrypt

COPY . .

CMD ["npm", "start"]
