const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema ({
    firstName : {
        type: String,
        minlenght: 4,
        trim: true,
        required:[true, "Enter your firstname"]
    },
    lastName : {
        type: String,
        minlenght: 4,
        trim: true,
        required:[true, "Enter your lastname"]
    },
    email : {
        type: String,
        minlenght: 4,
        trim: true,
        unique: true,
        required:[true, "Enter your email"]
    },
    password : {
        type: String,
        minlenght: 6,
        trim: true,
        required:[true, "Enter a password"]
    }

}, {
    timestamps : true
})

// userSchema.pre("save", async function (next){
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
// })

// userSchema.methods.isCorrectPassword = async function (inputedPassword) {
//     const isCorrectPassword = await bcrypt.compare(
//         inputedPassword,
//         this.password
//     );
//     return isCorrectPassword
// }


const User = mongoose.model("User", userSchema)
module.exports = User