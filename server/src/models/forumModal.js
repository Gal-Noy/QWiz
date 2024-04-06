const mongoose = require('mongoose');

// Schema for thread
const forumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    Comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    }
});

// Schema for message
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message',
        default: []
    }
});

// Create models from the schemas
const Forum = mongoose.model('Forum', forumSchema);
const Message = mongoose.model('Comments', commentSchema);

module.exports = {
    Forum,
    Message
};