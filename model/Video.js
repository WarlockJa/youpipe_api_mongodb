const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 1
    },
    author: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    uploaded: {
        type: Date,
        default: Date.now()
    },
    tags: [String],
    description: {
        type: String
    },
    rating: {
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        }
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Video', videoSchema)