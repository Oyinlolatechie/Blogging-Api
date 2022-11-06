//require necessary modules
const express = require('express')
const passport = require('passport')
require("dotenv").config()

const authRouter = require('./routes/authRouter')
const blogRouter = require('./routes/blogRouter')
const db = require('./models')
const app = express()


const PORT = process.env.PORT ||3000
 
//initialize passport
app.use(passport.initialize());
require("./middleware/passport")
//connect db
db.connectToMongoDB()



//setting middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use('/auth', authRouter)
app.use('/blogs', blogRouter)


app.get('/', (req, res)=>{
    res.send('Welcome home!')
})

app.get('*', (req, res)=>{
    res.send('Route doest not exist')
})
//set general error handler
app.use((err, req, res, next)=>{
    const statuscode = err.statuscode || 500
    const message = err.message || "internal server error occured!"
    return res.status(statuscode).json({status: "failed", message})
})

app.listen(PORT, ()=>{
    console.log(`server started, on PORT: http://localhost:${PORT}`)
})

module.exports = app