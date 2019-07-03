var mongoose = require("./../index");
var Schema = mongoose.Schema;
var User = new Schema({
    username: String,
    email: String,
    phone: Number,
    password: String,
    verify: { type: Boolean, default: false },
    otp: { type: Number },
    authkey:{type:String}
});

module.exports = mongoose.model("users", User)