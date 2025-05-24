const userRouter = require('express').Router()

const { signUp, login, profile, logOut, editProfile, allUser } = require('../controllers/userController')
const authUser = require('../middlewars/authUser')
const profileUpload = require('../middlewars/profileUpload')
const { signUpValidation, loginValidation } = require('../middlewars/userMiddleware')



userRouter.post('/signup', signUpValidation, signUp)
userRouter.post('/login', loginValidation, login)
userRouter.get('/profile', authUser, profile)
userRouter.get('/logout', authUser, logOut)
userRouter.put('/editprofile', authUser, profileUpload.single('file'), editProfile)
userRouter.get('/alluser', authUser, allUser)



module.exports = userRouter