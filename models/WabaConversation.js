const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conversationSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    templateType: {
        type: String
    },
    mainTemplate: {
        type: String
    },
    lastTimestamp: {
        type: Date
    },
    conversations: [{
        messageFrom: {
            type: String,
            enum: [
                "external",
                "internal"
            ],
        },
        messageType: {
            type: String,
            required: true,
            trim: true,
        },
        mainMessageType: {
            type: String,
            required: true,
            trim: true,
        },
        mainTemplate: {
            type: String
        },
        message: {
            type: Buffer
        },
        timestamp: {
            type: Date
        }
    }]
});

const WabaConversation = mongoose.model('WabaConversation', conversationSchema);

module.exports = WabaConversation;