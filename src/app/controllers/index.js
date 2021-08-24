const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
        .readdirSync(path.join(__dirname, 'api', 'user'))
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "contract.js")))
        .forEach(file => require(path.resolve(path.join(__dirname, 'api','user'),file))(app));
    fs
        .readdirSync(path.join(__dirname, 'api', 'client'))
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "contract.js")))
        .forEach(file => require(path.resolve(path.join(__dirname, 'api','client'),file))(app));
    fs
        .readdirSync(path.join(__dirname, 'api', 'contract'))
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "contract.js")))
        .forEach(file => require(path.resolve(path.join(__dirname, 'api','contract'),file))(app));
}

