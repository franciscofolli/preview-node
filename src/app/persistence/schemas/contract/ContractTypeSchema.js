const mongoose = require('../../../../infra/DBSource/MongoDatabase');

const ContractTypeSchema = new mongoose.Schema({
    contractType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    persistDate: {
        type: Date,
        default: Date.now
    },
    userAudit: {
        type: String,
        required: true
    }
});

const ContractType = mongoose.model('ContractType', ContractTypeSchema);

module.exports = ContractType;