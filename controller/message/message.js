
var Model = require("./../../db/schema");


const sendmessage = async (req,res) => {
    var friend_id = req.body.friend_id;
    var user_id = req.body.user_id;
    var message = req.body.message;
    if (friend_id == user_id) {
        return res.status(400).send({ msg:"Both Are Same Credential"})
    }
    var sent = await Model.MessageModel({ friend_id, user_id, message }).save();
    req.io.sockets.emit(`msg_${user_id}`, sent.message)

    return res.status(200).send({data:sent});
} 
const getmessage = async (req, res) => {
    var friend_id = req.query.friend_id;
    var user_id = req.query.user_id;
    if (user_id == friend_id) {
        return res.status(400).send({ msg:"Both Are Same Credential"});
    }
    var query = { $or: [{ user_id: user_id , friend_id: friend_id }, { user_id: friend_id , friend_id: user_id }] }
    var message = await Model.MessageModel.find(query).select({"username": 1, "_id": 1, "message": 1, "createdAt": 1 }).populate('user_id','username');
    req.io.sockets.emit("msg", message)
    return res.status(200).send({ message });
}


module.exports = {
    sendmessage, getmessage
}
