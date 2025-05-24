const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')


const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token
        const err = 'Unauthorized'
        if (!token) return res.status(401).json({ msg: err })

        const decoded = jwt.verify(token, process.env.JwtKey);
        if (!decoded) return res.status(401).json({ msg: err })
        const user = await userModel.findById(decoded.userId)
        if (!user) return res.status(401).json({ msg: err })
        req.user = user
        next()

    } catch (error) {
        res.status(500).json({ msg: `authorized error ${error}` })
        console.error(error)

    }

}
module.exports = authUser