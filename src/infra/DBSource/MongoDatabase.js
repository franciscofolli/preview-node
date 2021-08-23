const mongoose = require('mongoose');
require('dotenv/config');

const {
    DB_DATABASE,
    DB_HOSTNAME,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD
  } = process.env;

mongoose.connect(`mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_DATABASE}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('DB is connected to', db.connection.host))
    .catch(err => console.error('Error - Could not connect to mongo database\n' + err));

mongoose.Promise = global.Promise;

module.exports = mongoose;
