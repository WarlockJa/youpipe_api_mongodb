const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const result = await User.find({ "roles.admin": { $exists: false } }, { "_id": 0, "name": 1, "fullname": 1, "avatar": 1 });
    res.json(result);
}

module.exports = { getAllUsers }