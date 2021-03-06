require('dotenv/config');
require('./infra/DBSource/MongoDatabase');
const cors = require('cors')
const express = require('express');

const app = express();
const bodyParser = require('body-parser');


app.use(cors());

const {
  APP_URL,
  APP_PORT,
} = process.env;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

require('./app/controllers/index')(app);

app.listen(APP_PORT, () => {
    console.log(`SERVER STARTED [ON] [DEV1]: ${APP_URL}:${APP_PORT}`);
});



