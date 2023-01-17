const Comment = require('../model/Comment');

const getVideoComments = async (req, res) => {
    if(!req.body?.video) return res.status(400).json({ 'message': 'Video id required' });

    const match = { "video": req.body.video };
    const limit = req.body.amountToFind > 0 ? req.body.amountToFind : 0

    const hasMore = await Comment.count(match).limit(100000); // just a random limit
    const result = await Comment.find(match, { "author": 1, "comment": 1, "avatar": 1, "date": 1 }).limit(limit) .sort({ "date": -1 });
    
    res.json({ result: result, hasMore: hasMore - result.length });
}

module.exports = { getVideoComments }