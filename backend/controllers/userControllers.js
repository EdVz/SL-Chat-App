const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/generateToken');


const bcryptSalt = bcrypt.genSaltSync(10);

const registerUser = async (req, res) => {
    const { email, username, password } = req.body;


    if (!username || !email || !password) {
        res.status(400).json({ success: false, cause: "Please enter all the fields" });
        return;
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400).json({ success: false, cause: "User already exists" });
        return;
    }

    res.clearCookie('token');
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            email: email,
            username: username,
            password: hashedPassword,
        });

        generateToken(createdUser._id, username, res);

    } catch (err) {
        console.error('Error during user registration', err);
        res.status(400).json('Failed to create user');
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });

    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);

        res.clearCookie('token');
        if (passOk) {
            generateToken(foundUser._id, username, res);

        } else {
            console.log('Wrong Password');
        }
    } else {
        res.status(401).json({ success: false, cause: "Invalid Username" });
        return;
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token').json('Logged out Successfully');
};

const searchUser = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { username: { $regex: req.query.search, $options: "i" } },
        ]
    }
        : {};
    const foundUsers = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(foundUsers);
};

module.exports = { registerUser, loginUser, logoutUser, searchUser };