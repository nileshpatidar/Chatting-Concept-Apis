var mongoose = require('../index');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    friend_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    message_type: {
        type: String,
        enum: ['Text', 'Photos', 'Videos', 'Audio'],
    },
    message: {
        type: String
    },
    mesageStatus: {
        type: String,
        enum: ['Read', 'Unread'],
        default: 'Unread'
    }
}
    , {
        timestamps: true
    });

module.exports = mongoose.model("messages", messageSchema)