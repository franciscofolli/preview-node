const mongoose = require('../../../../infra/DBSource/MongoDatabase');


const ContractStatusSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
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

const ContractStatus = mongoose.model('ContractStatus', ContractStatusSchema);

module.exports = ContractStatus;