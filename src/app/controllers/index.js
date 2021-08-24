const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
        .readdirSync(path.join(__dirname, 'api'))
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(path.join(__dirname, 'api'),file))(app));
}