const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'User name and password are required' });

    const foundUser = await User.findOne({ name: username }).exec();
    if (!foundUser) return res.status(401).json({ 'message': 'No user found' });

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.name,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '600s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.name },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // refresh token cookie send as httpOnly so it cannot be accessed by JS. Sent with every request
        res.cookie('youpipe', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }) //Path: '/refresh', sameSite: 'None', secure: true, 
        // keep only in memory
        res.json({ accessToken });
    } else {
        res.status(401).json({ 'message': 'Password incorrect' });
    }
}

module.exports = { handleLogin }