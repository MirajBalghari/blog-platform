const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    caption: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    comment: [
        {
            content: { type: String },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model('posts', postSchema)