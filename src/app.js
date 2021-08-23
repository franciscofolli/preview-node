require('dotenv/config');
require('./infra/DBSource/MongoDatabase');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {
  APP_URL,
  APP_PORT,
} = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

require('./controllers/api/AuthController')(app);

app.listen(APP_PORT, () => {
    console.log(`SERVER STARTED [ON]: ${APP_URL}:${APP_PORT}`);
});



