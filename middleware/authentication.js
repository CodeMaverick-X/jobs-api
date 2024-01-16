const {UnauthenticatedError, BadRequestError} = require('../errors')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization || !authorization.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authorization.split(' ')[1]
    try {
        const data = jwt.verify(token, process.env.JWT_SECRETE)
        req.user = { userId: data.userId, name: data.name }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }

}

module.exports = auth