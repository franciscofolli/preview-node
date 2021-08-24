const mongoose = require('../../../../infra/DBSource/MongoDatabase');

const ContractInstallmentSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true,
    },
    installmentNumber: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true
    },
    principalValue: {
        type: Number,
        required: true,
    },
    interestValue: {
        type: Number,
        required: true,
    },
    interestDueValue: {
        type: Number,
        required: true,
    },
    installmentTotalValue: {
        type: Number,
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

const ContractInstallment = mongoose.model('ContractInstallment', ContractInstallmentSchema);

module.exports = ContractInstallment;