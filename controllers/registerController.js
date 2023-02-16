const User = require('../model/User');
const bcrypt = require ('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, fullName, password } = req.body;
    if(!user || !fullName || !password) return res.status(400).json({ 'message': 'User name, full name, and password are required'});
    
    const duplicate = await User.findOne({ name: user }).exec();
    if(duplicate) return res.sendStatus(409); //conflict

    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create and store the new user
        const result = await User.create ({
            "name": user,
            "fullname": fullName,
            "password": hashedPassword
        });

        res.status(201).json({ 'success': `New user ${user} created!` })
    } catch(err) {
        res.status(400).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser };