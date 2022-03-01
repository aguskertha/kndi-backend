const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const newspostSchema = new Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    publish: {
        type: Number,
        required: true
    },
    publishDate: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String
    },
    contents: [
        {
            title: {type: String, required: true, trim: true,},
            languageCode: {type: String, required: true},
            data: Schema.Types.Mixed
        }
    ],
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

newspostSchema.pre('save', function(next){
    this.createdAt = moment().format();
    this.updatedAt = moment().format();
    next();
});

newspostSchema.pre('updateOne', function(next){
    this.update({},{ $set: { updatedAt: moment().format() } });
    next();
});

const NewsPost = mongoose.model('NewsPost', newspostSchema);
module.exports = NewsPost;