// const { use } = require('express/lib/router')
const User = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors')


const register = async (req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJwt()
    res.status(201).json({ name: user.name, token})
}

const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new BadRequestError('please provide email and password')
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const token = user.createJwt()
    res.status(200).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login
}