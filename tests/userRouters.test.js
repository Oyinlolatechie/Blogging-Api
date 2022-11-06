
require('dotenv').config()

const app = require('../index')

const supertest = require('supertest')
const mongoose = require('mongoose')


const TEST_BLOG_URL = process.env.TEST_BLOG_URL

beforeAll((done) => {
    mongoose.connect(TEST_BLOG_URL)
    mongoose.connection.on('connected', async() => {
        console.log("MongoDb connected successfully")
    })

    mongoose.connection.on('error', (error) => {
        console.log("Connection to MongoDB failed", error)
    })
 done()
})


afterAll((done) => {
    mongoose.connection.close(done)
})

test('signUp', async ()=>{
    const userInfo = {
        firstName : "oyinlola",
        lastName : "Adepitan",
        email : "Oyinlola4@gmail.com",
        password : "Oyin20"
    }
    const res = await supertest(app)
    .post('/auth/signup')
    .set("content-type", 'application/x-www-form-urlencoded')
    .send(userInfo)
    console.log(res)
} )