const notificationRouter = require('express').Router()
const authUser = require('../middlewars/authUser')
const { getNotification, deleteOneNot, deleteAllNot } = require('../controllers/notificationController')


notificationRouter.get('/get', authUser, getNotification)
notificationRouter.delete('/deleteOne/:id', authUser, deleteOneNot)
notificationRouter.delete('/delete', authUser, deleteAllNot)

module.exports = notificationRouter