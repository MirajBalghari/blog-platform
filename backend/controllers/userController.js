const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path');
const fs = require('fs')


const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const checkuser = await userModel.findOne({ email })
        if (checkuser) return res.status(400).json({ msg: 'user is already exists' })
        const bcryptpassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            name,
            email,
            password: bcryptpassword
        })
        const token = jwt.sign({ userId: user._id, }, process.env.JwtKey, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "Strict",

        })
        res.status(201).json({ msg: 'SignUp successful', token })

    } catch (error) {
        console.error(`signup error ${error}`)
        return res.status(500).json({ msg: 'Internal signUp error ', error })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email }).select('+password')
        const err = 'Invalid email or password'
        if (!user) return res.status(400).json({ msg: err })
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) return res.status(400).json({ msg: err })

        const token = jwt.sign({ userId: user._id, }, process.env.JwtKey, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "Strict",


        })
        res.status(200).json({ msg: 'Login successful', token, })


    } catch (error) {
        console.error(`login error ${error}`)
        return res.status(500).json({ msg: 'Internal login error', error })
    }
}

const profile = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await userModel.findById(userId)
        if (!user) return res.status(401).json({ msg: 'User not found' })

        return res.status(200).json({ user })


    } catch (error) {
        return res.status(500).json({ msg: 'Internal profile error', error })

    }
}

const logOut = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: "none",

        })
        return res.status(200).json({ msg: "Logout successful" })

    } catch (error) {
        return res.status(500).json({ msg: 'Internal profile error', error })

    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (req.file && user.profilePic) {
            const oldpath = path.join(__dirname, '..', user.profilePic)
            if (fs.existsSync(oldpath)) {
                fs.unlinkSync(oldpath)
            }
        }
        if (req.file) {
            user.profilePic = `/uploads/profile/${req.file.filename}`
            await user.save()

        }
        return res.status(200).json({ msg: 'profile pic update successful', profilePic: user.profilePic })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};






module.exports = { signUp, login, profile, logOut, editProfile }