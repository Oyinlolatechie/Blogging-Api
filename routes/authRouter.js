const express = require('express')
const { signUp, signIn } = require('../controller/authController')

const authRouter = express.Router()


authRouter.post('/signup', signUp)

authRouter.post('/signin', signIn)


module.exports = authRouter