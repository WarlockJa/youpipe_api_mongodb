const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "/Assets/UserAvatars/usericon.png"
    },
    roles: {
        user: {
            type: Number,
            default: 2001
        },
        admin: {
            type: Number
        }
    },
    activity: {
        likes: [String],
        dislikes: [String],
        subscriptions: [String],
        subscribers: [String]
    },
    darktheme: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)