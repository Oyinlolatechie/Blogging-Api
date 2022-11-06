const mongoose = require('mongoose')
const objectId = mongoose.Schema.ObjectId

const Schema = mongoose.Schema

const blogSchema = new Schema ({
    title: {
        type: String,
        required: [true, "blog must have a title"],
        unique: [true, "Blog title should be unique"]
    },
    description: {
        type: String,
        minlenght: [6, "Description can't be less than six characters"],
        trim: true
    },
    author_id: {
        type: objectId,
        required: [true, "blog must have an author"],
        trim: true,
        ref: "User" 
    },
    author: {
        type: String,
        required: [true, "blog must have an author"],
        trim: true  
    },
    state: {
        type: String,
        enum: ["Draft","Published"],
        trim: true,
        default: "Draft"
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type:String,

    },
    tags: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },

})

const blog = mongoose.model('blog', blogSchema)
module.exports = blog