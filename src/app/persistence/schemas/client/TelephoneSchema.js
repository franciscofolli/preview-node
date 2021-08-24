const mongoose = require('../../../../infra/DBSource/MongoDatabase');

const TelephoneSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    ddd: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    }
});

const Telephone = mongoose.model('Telephone', TelephoneSchema);

module.exports = Telephone;