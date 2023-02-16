const Video = require('../model/Video');
const User = require('../model/User');

const createNewVideo = async (req, res) => {
    if(!req.user || !req.body.title || !req.body.image || !req.body.previewImage) {
        return res.status(400).json({'message': 'Author, video title, and video image are required'});
    }

    const userData = await User.findOne({ name: req.user }, { _id: 0, avatar: 1 }).exec();
    const newVideo = { author: req.user, avatar: userData.avatar, ...req.body };

    Video.create(newVideo, (err, result) => {
        if(err) {
            res.status(400).json({ 'message': err.message });
        } else {
            res.status(201).json(result);
        }
    })
}

module.exports = { createNewVideo };