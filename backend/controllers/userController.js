import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Auth user/set token
//route POST /api/users/auth
//@access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            user: user.name,
            email: user.email
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
    // restart.status(401)
    // throw new Error('Something went wrong')
    // res.status(200).json({ message: "Auth User123" })
})

// @desc Register a new user
//route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const user = await User.create({
        name, email, password
    })
    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            user: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user Data')
    }
    // res.status(200).json({ message: "Register a User" })
})

// @desc Logout a new user
//route POST /api/users/logout
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "User Logged out" })
})

// @desc Get a user profile
//route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
    console.log(req.user)
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user)
})

// @desc Update a user profile
//route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Update User Profile" })
})



export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}