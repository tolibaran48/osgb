const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conversationSchema = new Schema({
    type: {
        type: String,
        enum: ['Teklif', 'Pazarlama', 'Kariyer', 'iletisim'],
        required: true,
        default: 'iletisim',
    },
    name: {
        type: String,
    },
    e_mail: {
        type: String,
    },
    message: {
        type: String,
    },
    phone: {
        type: String
    },
    otp: {
        type: Schema.Types.ObjectId,
        ref: 'Otp',
        required: true
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;