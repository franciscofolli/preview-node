const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const mailResource = require('../../resources/mail.json');
const transport = nodemailer.createTransport(mailResource);


transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')
      },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));


module.exports = transport;