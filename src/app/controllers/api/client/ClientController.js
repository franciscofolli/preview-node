const express = require('express');
const authMiddleware = require('../../../middlewares/auth');
const ClientSchema = require('../../../persistence/schemas/client/ClientSchema');


const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {
        const clients = await ClientSchema.find();

        res.send({ clients, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Error - Could not load Clients!', errorLog: { err } })
    }
    
})

router.get('/:clientEmail', async (req,res) => {
    const email = req.params.clientEmail;
    try {
        if (email) {
            const client = await ClientSchema.findOne({ email })
            if(!client){
                res.status(404).send({ error: 'Error - Client not found', user: req.userId })      
            } else {
                res.send({ client, user: req.userId })
            }
        } else {
            res.status(400).send({ error: 'Error - Get parameter is empty', user: req.userId })
        }
        
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

router.post('/', async (req,res) => {
    const { name, email } = req.body;
    const userAudit = req.userId
    const now = new Date();
    try {

        const client = await ClientSchema.create({
            name,
            email,  
            persistDate: now,
            userAudit
        });

        client.userAudit = undefined;

        return res.send({ client: client, user: req.userId })
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: 'Error - Could not create new client!', errorLog: { err } })
    }
})

router.put('/:clientId', async (req,res) => {
    try {

        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

router.delete('/:clientId', (req,res) => {
    try {
        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

module.exports = app => app.use('/client', router);
