const express = require('express');
const authMiddleware = require('../../../middlewares/auth');
const ContractStatusSchema = require('../../../persistence/schemas/contract/ContractStatusSchema');


const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {
        const contractStatus = await ContractStatusSchema.find();

        res.send({ contractStatus, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Error - Could not load Contract Status!', errorLog: { err } })
    }
    
})

router.post('/', async (req,res) => {
    const now = new Date();
    try {

        const status = await ContractStatusSchema.create({
            ...req.body,
            persistDate: now,
            userAudit: req.userId
        });

        status.userAudit = undefined;

        return res.send({ contractStatus: status, user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Error - Could not create new Contract Status!'})
    }
})

router.put('/:statusId', async (req,res) => {
    const statusId = req.params.statusId;
    const now = new Date();
    try {
        if(!statusId) {
            return res.status(400).send({error: 'Error - Please pass the typeId on pathVariable!'})
        }

        const contractStatus = await ContractStatusSchema.findById(statusId);

        if(!contractStatus) {
            return res.status(404).send({ error: 'Error - Contract Type not found!'})
        }

        await contractStatus.updateOne({
            ...req.body, userAudit : req.userId, persistDate: now
        });

        return res.send({ sucess: 'Sucess - Contract Status info changed sucessfully', user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Status change failed!'});
    }
})

router.delete('/:statusId', async (req,res) => {
    const statusId = req.params.statusId;
    try {
        if (statusId) {
            await ContractStatusSchema.findByIdAndRemove(statusId);
            res.send({ error: 'Success - Contract Status removed successfully', user: req.userId })      
        } else {
            res.status(400).send({ error: 'Error - Get parameter is empty', user: req.userId })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Status remove failed!' })
    }
})



module.exports = app => app.use('/contract/status', router);
