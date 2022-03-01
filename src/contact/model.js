const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
let contactSchema = new Schema({
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
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

contactSchema.pre('save', function(next){
    this.createdAt = moment().format();
    this.updatedAt = moment().format();
    next();
});

contactSchema.pre('updateOne', function(next){
    this.update({},{ $set: { updatedAt: moment().format() } });
    next();
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;