const passport = require('passport')
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const UserModel = require('../models/userModel')

//set Jwt strategy
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use("jwt", new JWTstrategy( opts, (payload, done)=>{
        done(null, payload.user)
    }
));