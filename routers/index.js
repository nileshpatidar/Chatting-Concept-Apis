const express = require('express');
const router = express.Router();
var Auth = require("./../controller/authentication/userAuth");
var Friend = require("./../controller/friends/friends");
var Message = require("./../controller/message/message");


router.route('/reg').post(Auth.createUser);
router.route('/getuser').get(Auth.alluser);
router.route('/login').post(Auth.login);
router.route('/request').post(Friend.sendRequest);
router.route('/getrequest').get(Friend.getrequest);
router.route('/myfriends').get(Friend.myfriends);
router.route('/sendmessage').post(Message.sendmessage);
router.route('/getmessage').get(Message.getmessage);



module.exports=router;