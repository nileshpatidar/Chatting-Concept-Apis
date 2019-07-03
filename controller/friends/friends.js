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
            if (friends.friend_status == false){
                return res.status(400).send({ msg: 'Already Sent ' })
            } else if (friends.friend_status == true){
                return res.status(400).send({ msg: 'accepted Request' })
            }
        } else {
            var requested = await Model.friendModel({ user_id, friend_id }).save();
            if(requested.friend_id){
               var friendrequest= await Model.userModel.findById(friend_id).select({"username":1});
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
    var query = { $or: [{ user_id: user_id},{ friend_id: user_id }], friend_status: true }
    var friends = await Model.friendModel.find(query).select({ "_id": 1, "message": 1, "createdAt": 1 }).populate("user_id", 'username').populate('friend_id', "username");
    return res.status(200).send({ data: friends })
}

 

module.exports ={
    sendRequest, getrequest, myfriends
}
