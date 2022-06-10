const User = require("../models/userModal")
const generateToken = require("../config/generateToken")
const asyncHandler = require("express-async-handler");

const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body 

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please Enter all the feilds"
        })
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        });

    } else {
        res.status(400).json("User not found");
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json("Invalid Email or Password");
    }
}

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
    }
    : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    
    res.send(users);
})

module.exports = {
    registerUser, loginUser, allUsers
}