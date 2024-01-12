const jwt = require('jsonwebtoken');

const generateToken = (id, username, res) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
            id: id,
            username: username,
        });
    });
};

module.exports = generateToken;