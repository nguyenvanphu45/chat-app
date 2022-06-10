const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name: { 
            type: "String", 
            required: true 
        },
        email: { 
            type: "String", 
            unique: true, 
            required: true 
        },
        password: { 
            type: "String", 
            required: true 
        },
        pic: {
            type: "String",
            require: true,
            default: "https://thuvienplus.com/themes/cynoebook/public/images/default-user-image.png"
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    }, 
    {
        timeStamps: true
    }
)

// xac thuc password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

module.exports = User