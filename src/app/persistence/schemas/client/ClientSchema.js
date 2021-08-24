const mongoose = require('../../../../infra/DBSource/MongoDatabase');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    telephones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Telephone',
    }],
    persistDate: {
        type: Date,
        default: Date.now
    },
    userAudit: {
        type: String,
        required: true
    }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;