const express = require('express');
const authMiddleware = require('../../../middlewares/auth');
const ContractTypeSchema = require('../../../persistence/schemas/contract/ContractTypeSchema');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {
        const contractTypes = await ContractTypeSchema.find();

        res.send({ contractTypes, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Error - Could not load Contract Types!', errorLog: { err } })
    }
    
})

router.post('/', async (req,res) => {
    const { contractType, description } = req.body;
    const now = new Date();
    try {

        const type = await ContractTypeSchema.create({
            ...req.body,
            persistDate: now,
            userAudit: req.userId
        });

        type.userAudit = undefined;

        return res.send({ contractType: type, user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Error - Could not create new client!', errorLog: { err } })
    }
})

router.put('/:typeId', async (req,res) => {
    const typeId = req.params.typeId;
    const now = new Date();
    try {
        if(!typeId) {
            return res.status(400).send({error: 'Error - Please pass the typeId on pathVariable!'})
        }

        const contractType = await ContractTypeSchema.findById(typeId);

        if(!contractType) {
            return res.status(404).send({ error: 'Error - Contract Type not found!'})
        }

        await contractType.updateOne({
            ...req.body, userAudit : req.userId, persistDate: now
        });

        return res.send({ sucess: 'Sucess - Contract Type info changed sucessfully', user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Type change failed!'});
    }
})

router.delete('/:typeId', async (req,res) => {
    const typeId = req.params.typeId;
    try {
        if (typeId) {
            await ContractTypeSchema.findByIdAndRemove(typeId);
            res.send({ error: 'Success - Contract Type removed successfully', user: req.userId })      
        } else {
            res.status(400).send({ error: 'Error - Get parameter is empty', user: req.userId })
        }
        
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Contract Type remove failed!' })
    }
})


module.exports = app => app.use('/contract/type', router);
