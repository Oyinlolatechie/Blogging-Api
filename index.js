//required necessary modules
const express = require('express')
const passport = require('passport')
require("dotenv").config()

const errorHandler = require('./middleware/errorHandler')
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


//home route 
app.get('/', (req, res)=>{
    res.send('Welcome home!')
})

// app.get('*', (req, res)=>{
//     res.send('Route doest not exist')
// })

app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`server started, on PORT: http://localhost:${PORT}`)
})

module.exports = app