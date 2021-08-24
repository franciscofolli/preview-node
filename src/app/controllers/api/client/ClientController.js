const express = require('express');
const authMiddleware = require('../../../middlewares/auth');
const ClientSchema = require('../../../persistence/schemas/client/ClientSchema');


const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {

        const Clients = ClientSchema. 



        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
    
})

router.get('/:clientEmail', async (req,res) => {
    try {

        const Clients = ClientSchema. 



        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

router.post('/', async (req,res) => {
    try {

        const Clients = ClientSchema. 



        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

router.put('/', async (req,res) => {
    try {

        const Clients = ClientSchema. 



        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

router.delete('/', (req,res) => {
    try {

        const Clients = ClientSchema. 



        res.send({ ok: true, user: req.userId })
    } catch (err) {
        return res.status(400).send({ error: 'Client List failed!', errorLog: { err } })
    }
})

module.exports = app => app.use('/client', router);
