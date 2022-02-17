const NewsPost = require('./model');
const Slug = require('slug');

const createNewsPost = async (req, res, next) => {
    try{
        const contents = req.body.contents;
        let slug = '';
        const publish = 0;
        contents.forEach(content => {
            if(content.languageCode == 'en'){
                slug = Slug(content.title);
            }
        });
        const newNewspost = new NewsPost({slug, publish, contents});
        await newNewspost.save();
        res.json({message: 'News successfully created!'});
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const getNewsPosts = async (req, res, next) => {
    try{
        const newsposts = await NewsPost.find();
        res.json(newsposts);
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const deleteNewsPosts = async (req, res, next) => {
    try{
        await NewsPost.deleteMany();
        res.json({message: 'News successfully deleted!'});
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const createFile = async (req, res, next) => {
    try{
        res.json({
            url: req.file.path,
            fileName: req.file.filename
        });
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

module.exports = {
    createNewsPost,
    getNewsPosts,
    deleteNewsPosts,
    createFile
}