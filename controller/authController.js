const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//generate token
const getToken =  (user) => {
  const token = jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY_TIME })
  return token
}


//@desc sign up
//@route POST /users
//@access Public
exports.signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body

  //hash user inputted password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //create user, with hashed password
  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password : hashedPassword
    })

    user.password = undefined; //exclude password from token

    return res.status(201).json({
      status: "success",
      token : getToken(user),
      data: user
    })
  } catch (err) {
    return next(err)
  }
}


//@desc Sign in
//@route POST /users/login
//@access Public
exports.signIn = async (req, res, next) => {
  const { email, password } = req.body

     //Validate user input
      if(!email || !password) {
        res.status(400)
        return next(new Error("Enter email and password"))
      }
    
  try {
    //check if email entered exists
    const user = await UserModel.findOne({email})
    if(!user){
      res.status(400)
      return next(new Error('User not found'))
    } 
    
    //check if password entered macthes with stored harshed password
   if(user && (await bcrypt.compare(password, user.password))){
    
        res.status(201).json({
        status: "success",
        token : getToken(user),
        data: user
      })
    } else {
      res.status(400)
      return next(new Error("Incorrect password")) 
  }
   
  } catch (err) {
    return next(err)
  }
}