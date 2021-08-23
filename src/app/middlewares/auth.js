const jsonwebtoken = require('jsonwebtoken')
const auth = require('../../config/auth.json')



module.exports = (req, res, next) => { // next called only if the user has authorization to go to other pages
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(400).send({ error: 'No Token provided'});
    }

    const parts = authHeader.split(' ');

    if(!parts.length == 2) {
        return res.status(401).send({ error: 'Error - Token error' });
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Error - Token is bad formatted' });
    }

    jsonwebtoken.verify(token, auth.secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token inválido' });
        req.userId = decoded.id;
        return next();
    })
}