const express = require('express');
const authMiddleware = require('../../../middlewares/auth');
const ContractInstallmentSchema = require('../../../persistence/schemas/contract/ContractInstallmentSchema');


const router = express.Router();

router.use(authMiddleware);

router.get('/:contractId', async (req,res) => {
    const contractId = req.params.contractId;
    try {
        const contractInstallments = await ContractInstallmentSchema.find();

        res.send({ contractInstallments: contractInstallments, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Error - Could not load Contract Installments!', errorLog: { err } })
    }
    
})

// router.post('/', async (req,res) => {
//     const now = new Date();
//     try {

//         const status = await ContractStatusSchema.create({
//             ...req.body,
//             persistDate: now,
//             userAudit: req.userId
//         });

//         status.userAudit = undefined;

//         return res.send({ contractStatus: status, user: req.userId })
//     } catch (err) {
//         console.error(err);
//         return res.status(400).send({ error: 'Error - Could not create new Contract Status!'})
//     }
// })

router.put('/:installmentId', async (req,res) => {
    const installmentId = req.params.installmentId;
    const now = new Date();
    try {
        if(!installmentId) {
            return res.status(400).send({error: 'Error - Please pass the typeId on pathVariable!'})
        }

        const contractInstallment = await ContractInstallmentSchema.findById(installmentId);

        if(!contractInstallment) {
            return res.status(404).send({ error: 'Error - Contract Installment not found!'})
        }

        await contractInstallment.updateOne({
            ...req.body, userAudit : req.userId, persistDate: now
        });

        return res.send({ sucess: 'Sucess - Contract Installment info changed sucessfully', user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Installment change failed!'});
    }
})

router.delete('/:installmentId', async (req,res) => {
    const installmentId = req.params.installmentId;
    try {
        if (installmentId) {
            await ContractStatusSchema.findByIdAndRemove(installmentId);
            res.send({ error: 'Success - Contract Installment removed successfully', user: req.userId })      
        } else {
            res.status(400).send({ error: 'Error - Get parameter is empty', user: req.userId })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Installment remove failed!' })
    }
})


module.exports = app => app.use('/contract/installment', router);
