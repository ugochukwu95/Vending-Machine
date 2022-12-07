const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { userRoles } = require('../utils/consts')

// Users schema
const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        min: 5
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    deposit: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: userRoles,
        required: true,
    }
},
{
    timestamps: true
})

// before creating a new user change the format of the user password
UsersSchema.pre('save', function (next) {
    const user = this

    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next()
            }

            user.password = hash
            next()
        })
    })
})

// helper method to compare passwords
UsersSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

// generate a json web token for a user when they login
UsersSchema.methods.generateJWT = function () {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)
  
    const payload = {
        id: this._id,
        username: this.username,
        role: this.role
    }
  
    // expire in 2 weeks
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "14 days"
    })
}

module.exports = mongoose.model('User', UsersSchema)