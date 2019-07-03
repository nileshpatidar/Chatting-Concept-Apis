var mongoose = require('../index');

var Schema = mongoose.Schema;
var friendSchema = new Schema({
    friend_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    friend_status: {
        type: Boolean,
        default:false
                // enum: ['Accepted', 'Pending', 'Unfriend', 'Blocked'],
        // default: 'Pending'
    },
}
    , {
        timestamps: true
    });

module.exports = mongoose.model("friendrequests", friendSchema)