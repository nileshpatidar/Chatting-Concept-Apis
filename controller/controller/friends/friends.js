var Model = require("./../../db/schema");


const sendRequest = async (req, res) => {
    try {
        var friend_id = req.body.friend_id;
        var user_id = req.body.user_id;
        if (friend_id == user_id) {
            return res.status(400).send({ msg: "Same Credential" })
        }
        var ifuser = await Model.userModel.findById(user_id);
        if (!ifuser) {
            return res.status(404).send({ msg: "No User Found With Given Credential" });
        }
        var isfriend = await Model.friendModel.findById(user_id);
        if (isfriend) {
            return res.status(404).send({ msg: "No User  Found With Given Credential" })
        }
        var query = { $or: [{ user_id: friend_id, friend_id: user_id }, { friend_id, user_id }] };
        let issent = await Model.friendModel.findOne(query);
        if (issent) {
            var friend_status = !req.body.friend_status ? false : req.body.friend_status;
            var friends = await Model.friendModel.findOneAndUpdate(query, { $set: { user_id, friend_id, friend_status } }, { upsert: true, new: true });
            if (friends.friend_status == false) {
                return res.status(400).send({ msg: 'Already Sent ' })
            } else if (friends.friend_status == true) {
                return res.status(400).send({ msg: 'accepted Request' })
            }
        } else {
            var requested = await Model.friendModel({ user_id, friend_id }).save();
            if (requested.friend_id) {
                var friendrequest = await Model.userModel.findById(friend_id).select({ "username": 1 });
            }
            req.io.sockets.emit(`reqnotification_${friend_id}`, friendrequest)
            return res.status(200).send({ msg: "Requested", data: { id: requested._id, friend_status: requested.friend_status } })
        }
    } catch (err) {
        res.status(400).send(err)
    }
}

const getrequest = async (req, res) => {
    var user_id = req.query.user_id;
    let requests = await Model.friendModel.find({ user_id: user_id, friend_status: false });

    return res.status(200).send({ data: requests })
}

const myfriends = async (req, res) => {
    var user_id = req.query.user_id;
    var query = { $or: [{ user_id: user_id }, { friend_id: user_id }], friend_status: true }
    // var friends = await Model.friendModel.find(query).select({ "_id": 1, "message": 1, "createdAt": 1 }).populate("user_id", 'username').populate('friend_id', "username");
    var friends = await Model.friendModel.aggregate([
        {
            $lookup: {
                from: "users",
                let: {
                    friend_id: "$friend_id",
                    user_id: "$user_id"
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $or: [
                                { $and: [{ $eq: ["$_id", "$$user_id"] }, { $ne: ["$$user_id", user_id] }] },
                                { $and: [{ $eq: ["$_id", "$$friend_id"] }, { $ne: ["$$friend_id", user_id] }] }
                            ]
                        }
                    },
                },
                { $project: { username: 1 } }
                ],
                as: "friends"
            }
        },

        // { $addFields: { user_id: { $toString: "$user_id" }, friend_id: { $toString: "$friend_id" } } },
        // { $match: { $or: [{ user_id: user_id }, { friend_id: user_id }], friend_status: true } },
        // { $addFields: { friendIds2: { $toObjectId: "$user_id" }, friendIds: { $toObjectId: "$friend_id" } } },
        // { $lookup: { from: 'users', localField: "friendIds", foreignField: "_id", as: "usercollection" } },
        // { $lookup: { from: 'users', localField: "friendIds2", foreignField: "_id", as: "usercollection1" } },
        // { $project: { "items": { $concatArrays: ["$usercollection1", "$usercollection"], "$user_id": 1 } }, },
        // { $unwind: "$items" },
        // { $replaceRoot: { newRoot: "$items" } },
        // { $project: { "_id": { $ne: "$user_id" }, "email": 1, "username": 1 } },
    ])
    return res.status(200).send({ data: friends })
}



module.exports = {
    sendRequest, getrequest, myfriends
}
