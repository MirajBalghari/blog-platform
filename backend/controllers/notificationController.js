const notificationModel = require('../models/notificationModel')

const getNotification = async (req, res) => {
    try {
        const id = req.user._id
        const notification = await notificationModel.find({ receiver: id })
            .populate('relatedUser', 'name email profilePic')
            .populate('relatedPost', 'image caption title').sort({ createdAt: -1 })

        return res.status(200).json({ msg: 'get all Notification', notification, success: true })
    } catch (error) {

    }
}

const deleteOneNot = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user._id
        if (!userId) return res.status(400).json({ msg: 'you not delete notification', success: false })

        await notificationModel.findOneAndDelete({
            _id: id,
            receiver: userId
        })

        return res.status(200).json({ msg: 'Delete notification ', success: true })
    } catch (error) {

    }
}

const deleteAllNot = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) return res.status(400).json({ msg: 'you not delete notification', success: false })
        await notificationModel.deleteMany({
            receiver: userId
        })
        return res.status(200).json({ msg: 'Delete all notification', success: true })
    } catch (error) {

    }
}



module.exports = { getNotification, deleteOneNot, deleteAllNot }