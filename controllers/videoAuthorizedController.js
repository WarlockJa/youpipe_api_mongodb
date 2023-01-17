const Video = require('../model/Video');

const createNewVideo = async (req, res) => {
    if(!req.user || !req.body.title || !req.body.image) {
        return res.status(400).json({'message': 'Author, video title, and video image are required'})
    }

    const newVideo = { author: req.user, ...req.body }

    Video.create(newVideo, (err, result) => {
        if(err) {
            res.status(400).json({ 'message': err.message });
        } else {
            res.status(201).json(result);
        }
    })
}

module.exports = { createNewVideo };