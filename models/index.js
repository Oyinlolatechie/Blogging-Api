const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URL = process.env.MONGODB_URL

function connectToMongoDB (){
    mongoose.connect(MONGODB_URL)

    mongoose.connection.on('connected', async ()=>{
        console.log("MongoDb connected successfully")
    })

    mongoose.connection.on('error', (error)=>{
        console.log("Connection to MongoDB failed", error)
    })

}

module.exports = {connectToMongoDB}