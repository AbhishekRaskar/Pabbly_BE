const express = require('express');
const bcrypt = require('bcrypt');
const { userModel } = require('../Models/userModel');
const jwt = require('jsonwebtoken'); // Import JWT library

const userRouter = express.Router();


// Signup
userRouter.post('/signup', async (req, res) => {
    const { name, email, password, age } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (user) {
            res.status(400).json({ msg: 'User is already registered.' });
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    const newUser = new userModel({ name, email, password: hash, age });
                    await newUser.save();
                    res.status(200).json({ msg: 'User has been registered successfully.' });
                }
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userName: user.name, userID: user._id }, process.env.secret);

                    // Send token along with user details
                    res.status(200).json({
                        msg: "Login Successful!",
                        token: token,
                        user: {
                            userName: user.name,
                            userEmail: user.email
                        }
                    });
                } else {
                    res.status(400).json({ msg: "Wrong Credentials" });
                }
            });
        } else {
            res.status(400).json({ msg: "User not Exist" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = {
    userRouter
};
