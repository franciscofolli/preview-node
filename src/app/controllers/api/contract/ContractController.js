const express = require('express');
const authMiddleware = require('../../../middlewares/auth');
const ContractSchema = require('../../../persistence/schemas/contract/ContractSchema');
const ContractInstallmentSchema = require('../../../persistence/schemas/contract/ContractInstallmentSchema');

const router = express.Router();






router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {
        const contractStatus = await ContractSchema.find().populate('contractInstallments');

        res.send({ contractStatus, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Error - Could not load Contracts!', errorLog: { err } })
    }
    
})

router.post('/', async (req,res) => {
    const { contract, installmentNumbers } = req.body;
    const now = new Date();
    try {
        const contractSaved = await ContractSchema.create({
            ...contract,
            persistDate: now,
            userAudit: req.userId
        });

        const installmentObject = {
            contract: contractSaved._id,
            principalValue: (contractSaved.principalValue / installmentNumbers).toFixed(2),
            interestValue: 0,
            interestDueValue: 0,
            installmentTotalValue: (contractSaved.totalDebt / installmentNumbers).toFixed(2),
            persistDate: now,
            userAudit: req.userId
        }

        let installments = [];
        let date = contractSaved.openingDate;

        for(var x = 1 ; x <= installmentNumbers ; x++){
            const installmentSchema = new ContractInstallmentSchema({ ...installmentObject, installmentNumber: x,
                dueDate: date.setMonth(contractSaved.openingDate.getMonth()+1)});
            installments.push(installmentSchema);
        }
        
        await Promise.all(installments.map(async installment => {
            await installment.save();
            contractSaved.contractInstallments.push(installment);
        }));

        await contractSaved.save();
        
        contractSaved.userAudit = undefined;

        return res.send({ contract: contractSaved.populate('contractInstallments'), user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Error - Could not create new Contract!'})
    }
})

router.put('/:contractId', async (req,res) => {
    const contractId = req.params.contractId;
    const now = new Date();
    try {
        if(!contractId) {
            return res.status(400).send({error: 'Error - Please pass the typeId on pathVariable!'})
        }

        const contract = await ContractSchema.findById(contractId);

        if(!contract) {
            return res.status(404).send({ error: 'Error - Contract not found!'})
        }

        await contractStatus.updateOne({
            ...req.body, userAudit : req.userId, persistDate: now
        });

        return res.send({ sucess: 'Sucess - Contract info changed sucessfully', user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract change failed!'});
    }
})

router.delete('/:contractId', async (req,res) => {
    const contractId = req.params.contractId;
    try {
        if (contractId) {
            await ContractSchema.findByIdAndRemove(contractId);
            res.send({ error: 'Success - Contract removed successfully', user: req.userId })      
        } else {
            res.status(400).send({ error: 'Error - Get parameter is empty', user: req.userId })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Status remove failed!' })
    }
})


module.exports = app => app.use('/contract', router);
