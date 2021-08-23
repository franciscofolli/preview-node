FROM node:14

LABEL maintainer "Francisco Folli <franciscoabel2001@gmail.com>"

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
