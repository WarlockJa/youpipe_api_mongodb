const Comment = require('../model/Comment');

const createNewComment = async (req, res) => {
    if(!req.user || !req.body.comment || !req.body.video || !req.body.avatar) {
        return res.status(400).json({ 'message': 'Author, avatar, comment text, and video id are required' });
    }

    const newComment = { author: req.user, ...req.body }

    Comment.create(newComment, (err, result) => {
        if(err) {
            res.status(400).json({ 'message': err.message });
        } else {
            res.status(201).json(result);
        }
    })
}

const updateComment = async (req, res) => {
    if(req.body.avatar) {
        // handling avatar change by the user
        if(!req.user || req.body.avatar === '') return res.status(400).json({ 'message': 'User id and non-empty avatar field required for this operation' });

        Comment.updateMany({ "author": req.body.user }, { $set: { "avatar": req.body.avatar } }, (err, result) => {
            if(err) {
                res.sendStatus(400);
            } else {
                result.acknowledged ? res.sendStatus(200) : res.sendStatus(400);
            }
        })
    } else {
        // handling a comment change
        if(!req.body.id || req.body.comment === '') return res.status(400).json({ 'message': 'Comment id required. New comment cannot be an empty string' });
        
        Comment.updateOne({ "_id": req.body.id }, { $set: req.body }, (err, result) => {
            if(err) {
                res.sendStatus(400);
            } else {
                result.acknowledged ? res.sendStatus(200) : res.sendStatus(400);
            }
        })
    }
}

const deleteComment = async (req, res) => {
    if(!req.body.id) {
        return res.status(400).json({ 'message': 'Comment id required' });
    }
    // checking that delete command is issued by the author or admin
    const result = await Comment.findOne({ "_id": req.body.id });

    if(!result) return res.status(201).json({ 'message': 'Comment not found'});
    if(result.author !== req.user && !req.roles.includes(5150)) {
        res.status(401).json({ 'message': 'Only owner or admin may delete comments' });
    } else {
        Comment.deleteOne({ "_id": req.body.id }, (err, result) => {
            if(err) {
                res.sendStatus(400);
            } else {
                res.status(200).json({ 'message': result });
            }
        });
    }
}

module.exports = { createNewComment, updateComment, deleteComment };