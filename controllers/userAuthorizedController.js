const User = require('../model/User');
const Video = require('../model/Video');
const Comment = require('../model/Comment');

// get user Token request
const getAuthorizedUserData = async (req, res) => {
    if(!req.user) {
        return res.sendStatus(400)
    }

    const result = await User.findOne({ name: req.user }, { _id: 0, name: 1, fullname: 1, avatar: 1, activity: 1, darktheme: 1 }).exec();
    res.json(result);
}

// spam protection
// several collections may need to finish updating before another request is permitted
// to ensure this user name is added to the cancelArray on request start and removed at the request complete
// so only one request is being processed at the same time
const cancelState = [];
// update user data and associated collections (e.g. avatar field) if necessary
const updateUserData = async (req, res) => {
    if(!req.user) {
        return res.sendStatus(400);
    }
    
    // spam protection
    if(cancelState.find(item => item === req.user)) return res.sendStatus(503);
    cancelState.push(req.user);
    
    // checking if dark theme preference needs changing
    if(req.body.darktheme !== undefined) {
        try {
            await User.updateOne({ "name": req.user }, { darktheme: req.body.darktheme });
        } catch (error) {
            cancelState.splice(cancelState.indexOf(req.user), 1);
            return res.sendStatus(500);
        } finally {
            cancelState.splice(cancelState.indexOf(req.user), 1);
            return res.sendStatus(200);
        }
    }

    // checking that there is at least one viable field present to update in the request body
    // to avoid unnecessary db requests
    if(!req.body?.avatar && !req.body?.activity?.likes && !req.body?.activity?.dislikes && !req.body?.activity?.subscriptions) {
        return res.sendStatus(200);
    }

    // found fields to update
    // getting current user data for comparison
    const userOldData = await User.findOne({ "name": req.user }).exec();

    // checking if update contains an avatar field
    if(req.body.avatar) {
        if(req.body.avatar !== userOldData.avatar) {
            // updating Videos and Comments collections with the new avatar field
            try {
                await Video.updateMany({ "author": req.user }, { $set: { "avatar": req.body.avatar } });
                await Comment.updateMany({ "author": req.user }, { $set: { "avatar": req.body.avatar } });
                await User.updateOne({ "name": req.user }, { $set: { "avatar": req.body.avatar } });
            } catch (error) {
                cancelState.splice(cancelState.indexOf(req.user), 1);
                return res.sendStatus(500);
            } finally {
                cancelState.splice(cancelState.indexOf(req.user), 1);
                return res.sendStatus(200);
            }
        } else { return res.sendStatus(200); }
    }

    // changing user data and associated video data on like
    if(req.body.activity.likes) {
        // validating video id
        if(await Video.findOne({ "_id": req.body.activity.likes }).count() === 0) {
            return res.status(400).json({ "message": "Video doesn't exist" });
        }else{
            // checking if video already liked
            if(userOldData.activity.likes.includes(req.body.activity.likes)) {
                // removing video from the liked
                try {
                    await Video.updateOne({ "_id": req.body.activity.likes }, { $inc: { "rating.likes": -1 } });
                    await User.updateOne({ "name": req.user }, { "activity.likes": userOldData.activity.likes.filter(item => item!==req.body.activity.likes) })
                } catch (error) {
                    cancelState = cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(500);
                } finally {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(204);
                }
            }else{
                // adding video to the liked array
                try {
                    await Video.updateOne({ "_id": req.body.activity.likes }, { $inc: { "rating.likes": 1 } });
                    await User.updateOne({ "name": req.user }, { "activity.likes": [...userOldData.activity.likes, req.body.activity.likes] })
                } catch (error) {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(500);
                } finally {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(201);
                }
            }
        }
    }

    // changing user data and associated video data on dislike
    if(req.body.activity.dislikes) {
        // validating video id
        if(await Video.findOne({ "_id": req.body.activity.dislikes }).count() === 0) {
            return res.status(400).json({ "message": "Video doesn't exist" });
        }else{
            // checking if video already disliked
            if(userOldData.activity.dislikes.includes(req.body.activity.dislikes)) {
                // removing video from the disliked
                try {
                    await Video.updateOne({ "_id": req.body.activity.dislikes }, { $inc: { "rating.dislikes": -1 } });
                    await User.updateOne({ "name": req.user }, { "activity.dislikes": userOldData.activity.dislikes.filter(item => item!==req.body.activity.dislikes) })
                } catch (error) {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(500);
                } finally {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(204);
                }
            }else{
                // adding video to the disliked array
                try {
                    await Video.updateOne({ "_id": req.body.activity.dislikes }, { $inc: { "rating.dislikes": 1 } });
                    await User.updateOne({ "name": req.user }, { "activity.dislikes": [...userOldData.activity.dislikes, req.body.activity.dislikes] })
                } catch (error) {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(500);
                } finally {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(201);
                }
            }
        }
    }

    // changing user data and associated user data on subscribe
    if(req.body.activity.subscriptions) {
        // validating video id
        if(await User.findOne({ "name": req.body.activity.subscriptions }).count() === 0) {
            return res.status(400).json({ "message": "Channel doesn't exist" });
        }else{
            // checking if user already subscribed to the channel
            if(userOldData.activity.subscriptions.includes(req.body.activity.subscriptions)) {
                // removing subscription
                try {
                    // removing user from the channel's subscribers
                    await User.updateOne({ "name": req.body.activity.subscriptions }, { $pull: { "activity.subscribers": req.user } });
                    // removing channel from user's subscriptions
                    await User.updateOne({ "name": req.user }, { "activity.subscriptions": userOldData.activity.subscriptions.filter(item => item!==req.body.activity.subscriptions) })
                } catch (error) {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(500);
                } finally {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(204);
                }
            }else{
                // subscribing to the channel
                try {
                    // adding user info to the subscribers array on the channel
                    await User.updateOne({ "name": req.body.activity.subscriptions }, { $push: { "activity.subscribers": req.user } });
                    // adding subscribtion to the channel in the user info
                    await User.updateOne({ "name": req.user }, { "activity.subscriptions": [...userOldData.activity.subscriptions, req.body.activity.subscriptions] })
                } catch (error) {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(500);
                } finally {
                    cancelState.splice(cancelState.indexOf(req.user), 1);
                    return res.sendStatus(201);
                }
            }
        }
    }
}

module.exports = { getAuthorizedUserData, updateUserData }