const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../../../persistence/schemas/UserSchema');
const authConfig = require('../../../../resources/auth.json');
const crypto = require('crypto');
const nodeMailer = require('../../../../infra/EmailSource/NodeMailer');


const router = express.Router();

function generateToken(params = {}){
    return jsonwebtoken.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', async (req,res) => {
    const { name, email, password } = req.body;
    const now = new Date();
    const userAudit = 'Registered by User Service';
    try {
        if(await User.findOne({ email })){
            return res.status(400).send({ error: 'User already exists' })
        }

        const user = await User.create({
            name,
            email,
            password,    
            persistDate: now,
            userAudit
        });

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

router.post('/forgotPassword', async (req,res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).send({ error : 'Error - User not found!'});
        }; 

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.updateOne({ email: user.email }, {
                passwordResetToken: token,
                passwordResetExpires: now
        })
        nodeMailer.sendMail({
            to: email,
            from: 'franciscoabel2001@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err)
                return res.status(400).send({ error: 'Error - could not send reset password E-mail',
                                                detail: { err }
                                            })
            return res.send({ message: 'Success - Send recovery message to email'})
        })

    } catch (err) {
        res.status(400).send({ error: 'Error - forgot password not worked, try again'});
    }
})

router.post('/resetPassword', async (req,res) => {
    const { email, token, password} = req.body;

    try{
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
        const now = new Date();

        if(!user)
            return res.status(404).send({ error : 'Error - User not found!'});

        if(!(token === user.passwordResetToken))
            return res.status(400).send({ error : 'Error - invalid Token!'});

        if(now > user.passwordResetExpires)
            return res.status(401).send({ error : 'Error - Token expired, generate a new one!'});

        user.password = password;

        await user.save();

        return res.status(200).send({ success : 'Success - Password changed successfully!'});

    } catch (err) {
        console.error(err)
        res.status(400).send({ error: 'Error - reset password not worked, try again',
                                detail: { err }                            
    });
    }
})


module.exports = app => app.use('/auth', router);
