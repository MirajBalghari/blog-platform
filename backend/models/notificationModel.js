const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    type: {
        type: String,
        enum: ['like', 'comment']
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }
}, { timestamps: true })


module.exports = mongoose.model('notifications', notificationSchema)