const { ObjectId } = require('mongodb');
const Video = require('../model/Video');

const getVideos = async (req,res) => {
    if(isNaN(req.body.amountToFind) || Number(req.body.amountToFind) < 1) return res.status(400).json({ 'message': 'Non-zero amount to find is required' })
    
    // creating variables for the pipeline
    let match = {}
    let skip = 0;
    let limit = 0;
    let sort = { };

    if(req.body?.query) {
        try {
            switch(req.body.query.type) {
                case "author":
                    match = { "author": { $in: req.body.query.field } };
                    break;
                case "tags":
                    match = { "tags": { $in: req.body.query.field } };
                    break;
                case "search":
                    const regExArray = req.body.query.field.split(' ').map(item => {
                        const regEx = new RegExp(item, 'i')
                        return [{ author: regEx }, { title: regEx }]
                    }).flat();
                    match = { $or: regExArray };
                    break;
                case "liked":
                    const searchLiked = req.body.query.field.map(item => ObjectId(item));
                    match = { "_id": { $in: searchLiked } };
                    break;
                case "video":
                    match = { "_id": ObjectId(req.body.query.field) };
                    break;
            }

            skip = req.body.amountToSkip
                ? Number(req.body.amountToSkip) >= 0 ? Number(req.body.amountToSkip) : 0
                : 0
        
            limit = Number(req.body.amountToFind)
        
            sort[req.body.fieldToSortBy] = -1;

        } catch (error) {
            return res.sendStatus(400);
        }
    }

    const pipeline = [
        {
            '$match': match
        },
        {
            '$skip': skip
        },
        {
            '$limit': limit
        },
        // aggregating avatar field from the User collection. Changed due to inefficiency
        // replaced with data redundancy but hey, works faster
        // {
        //     '$lookup': {
        //         'from': 'users', 
        //         'localField': 'author', 
        //         'foreignField': 'name', 
        //         'as': 'avatar'
        //     }
        // },
        // {
        //     '$set': {
        //         'avatar': {
        //             '$arrayElemAt': [
        //                 '$avatar.avatar', 0
        //             ]
        //         }
        //     }
        // },
        {
            '$sort': sort
        }
    ];

    let hasMore = 0;
    let result = [];

    try {
        hasMore = await Video.count(match).limit(100000); // just a random limit
        result = await Video.aggregate(pipeline);
    } catch (error) {
        return res.sendStatus(500);
    }

    res.json({ result: result, hasMore: hasMore - result.length });
}

module.exports = { getVideos }