const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conversationSchema = new Schema({
    type: {
        type: String,
        enum: ['Teklif', 'Pazarlama', 'Kariyer', 'İletisim'],
        required: true,
        default: 'Communication',
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
        type: String,
        unique: true,
        length: 15,
    },
    otp: {
        type: Schema.Types.ObjectId,
        ref: 'Otp',
        required: true
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;