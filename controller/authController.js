const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')


const getToken = function (user) {
  const payload = { user }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_TIME })
  return token
}

exports.signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body
  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password
    })
    user.password = undefined;
    const token = getToken(user);
    return res.status(201).json({
      status: "success",
      token,
      data: user
    })
  } catch (err) {
    return next(err)
  }
}


exports.signIn = async (req, res, next) => {
  console.log(req.headers)
  const { email, password } = req.body
  if(!email || !password) return next(new Error ("Enter email and password"))

  try {
    const user = await UserModel.findOne({email})
    if(!user) return next(new Error('user not found'))
    
    const isCorrectPassword = await user.isCorrectPassword(password)
    if(!isCorrectPassword) return next(new Error ("incorrect Password"))
    const token = getToken(user);
    return res.status(201).json({
      status: "success",
      token,
      data: user
    })
  } catch (err) {
    return next(err)
  }
}