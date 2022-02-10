const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    }
}, {timestamps: true,});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;