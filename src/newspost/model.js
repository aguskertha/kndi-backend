const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
        type: String,
        required: true
    },
    contents: [
        {
            title: {type: String, required: true, trim: true,},
            languageCode: {type: String, required: true},
            data: Schema.Types.Mixed
        }
    ]
}, {timestamps: true,});

const NewsPost = mongoose.model('NewsPost', newspostSchema);
module.exports = NewsPost;