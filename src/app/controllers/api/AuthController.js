const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../persistence/schemas/UserSchema');
const authConfig = require('../../../config/auth.json');


const router = express.Router();

function generateToken(params = {}){
    return jsonwebtoken.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', async (req,res) => {
    const { email } = req.body;
    try {
        if(await User.findOne({ email })){
            return res.status(400).send({ error: 'User already exists' })
        }
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user })

    } catch (e) {
        return res.status(400).send({ error: 'Registration Failed!',
                                      errorLog: { e }
                                    })
    }
})

router.post('/authenticate', async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return res.status(400).send({ error : 'Error - User not found!'});
    }; 

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error : 'Error - Invalid Password'});
    };

    user.password = undefined;

    res.send({ user, 
                token: generateToken({ id: user.id}) })
            });


module.exports = app => app.use('/auth', router);
