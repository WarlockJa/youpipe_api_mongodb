const User = require('../model/User');

const handleLogout = async (req, res) => {
    // on client also delete the access token
    const cookies = req.cookies;
    if(!cookies?.youpipe) return res.sendStatus(204); // no content to send back

    const refreshToken = cookies.jwt
    // check if refreshToken in DB
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('youpipe', { httpOnly: true, sameSite:'None', secure: true }); 
        return res.sendStatus(204);
    }

    // delete refreshToken in the DB
    const result = await User.updateOne({ _id: foundUser._id }, {$set: { refreshToken: null }});

    res.clearCookie('youpipe', { httpOnly: true, sameSite:'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }