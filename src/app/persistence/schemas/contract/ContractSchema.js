const mongoose = require('../../../../infra/DBSource/MongoDatabase');

const ContractSchema = new mongoose.Schema({
    contractStatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractStatus',
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    contractInstallments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractInstallment',
    }],
    contractCode: {
        type: String,
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
    totalDebt: {
        type: Number,
        required: true,
    },
    openingDate: {
        type: Date,
        required: true,
    },
    endingDate: {
        type: Date,
        required: true,
    },
    originalEndDate: {
        type: Date,
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

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;