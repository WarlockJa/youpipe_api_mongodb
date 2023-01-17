const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.youpipe) return res.sendStatus(401);

    const refreshToken = cookies.youpipe

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ 'message': `${err.message}` });
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "600s" }
            );
            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }