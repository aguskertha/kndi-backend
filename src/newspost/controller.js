const NewsPost = require('./model');
const Slug = require('slug');
const ObjectID = require('mongodb').ObjectId;
const fs = require('fs');
const sharp = require('sharp');
const moment = require('moment');

const createNewsPost = async (req, res, next) => {
    try{
        let thumbnailURL = req.body.thumbnailURL;
        const contents = req.body.contents;
        let slug = '';
        const publish = 0;
        const publishDate = '-';
        if (thumbnailURL == '') {
            thumbnailURL = '/public/images/default-image-thumbnail.webp';
        }
        contents.forEach(content => {
            if(content.languageCode == 'en'){
                slug = Slug(content.title);
            }
        });
        const newNewspost = new NewsPost({slug, publish, publishDate, thumbnailURL, contents});
        await newNewspost.save();
        res.json({message: 'News successfully created!'});
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const getNewsPosts = async (req, res, next) => {
    try{
        let newsposts = await NewsPost.find().sort({'createdAt': -1});
        if(req.query.publish){
            newsposts = await NewsPost.find({publish: req.query.publish}).sort({'createdAt': -1});
        }
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

const createFiles = async (req, res, next) => {
    try{
        fs.access("./public/images/", (error) => {
            if (error) {
                fs.mkdirSync("./public/images/");
            }
        });
        let files = [];
        await Promise.all(req.files.files.map(async (file) => {
            const { buffer, originalname } = file;
            const fileName = originalname.replace(/\s/g, '');
            const filterFileName = fileName.replace(/\.[^/.]+$/, "");
            const date = moment().format('YYYY-MM-DD-hh-mm-ss');
            const ref = date+'-'+filterFileName.toLowerCase()+'.webp';
            await sharp(buffer)
                .webp({ quality: 20 })
                .toFile("./public/images/" + ref);
            const url = `/public/images/${ref}`;
            const data = {
                url,
                fileName : ref
            }
            files.push(data);
        }));
        res.json(files);
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const createVideos = async (req, res, next) => {
    try{
        let files = [];
        req.files.files.forEach(file => {
            const data = {
                url: file.path,
                fileName: file.filename
            }
            files.push(data);
        });
        res.json(files);
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const createImages = async (req, res, next) => {
    await createFiles(req, res, next);
}

const createFile = async (req, res, name) => {
    try{
        fs.access("./public/images/", (error) => {
            if (error) {
                fs.mkdirSync("./public/images/");
            }
        });
        const { buffer, originalname } = req.file;
        const fileName = originalname.replace(/\s/g, '');
        const filterFileName = fileName.replace(/\.[^/.]+$/, "");
        const date = moment().format('YYYY-MM-DD-hh-mm-ss');
        const ref = date+'-'+filterFileName.toLowerCase()+name+'.webp';
        await sharp(buffer)
            .webp({ quality: 20 })
            .toFile("./public/images/" + ref);
        const url = `/public/images/${ref}`;
        res.json({
            url,
            fileName : ref
        });
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const createThumbnail = async (req, res, next) => {
    await createFile(req, res, '-thumbnail');
}

const changeNewsPostToPublish = async (req, res, next) => {
    try {
        const newspostID = req.body.newspostID;
        const newspost = await NewsPost.findOne({_id: ObjectID(newspostID)});
        if(!newspost){
            throw 'News not found!';
        }
        await NewsPost.updateOne(
            { _id: ObjectID(newspost._id) },
            {
                $set: {
                    publish: 1,
                    publishDate: moment().format('LLLL')
                }
            }
        )
        res.json({ message: 'News successfully published!' });
    } catch (err) {
        res.status(400).json({message: [err.toString()]});
    }
}

const changeNewsPostToDraft = async (req, res, next) => {
    try {
        const newspostID = req.body.newspostID;
        const newspost = await NewsPost.findOne({_id: ObjectID(newspostID)});
        if(!newspost){
            throw 'News not found!';
        }
        await NewsPost.updateOne(
            { _id: ObjectID(newspost._id) },
            {
                $set: {
                    publish: 0,
                    publishDate: '-'
                }
            }
        )
        res.json({ message: 'News successfully drafted!' });
    } catch (err) {
        res.status(400).json({message: [err.toString()]});
    }
}

const getNewsPostByID = async (req, res, next) => {
    try {
        const newspostID = req.params.newspostID;
        const newspost = await NewsPost.findOne({_id: ObjectID(newspostID)});
        if(!newspost){
            throw 'News not found!';
        }
        res.json(newspost);
    } catch (err) {
        res.status(400).json({message: [err.toString()]});
    }
}

const getNewsPostBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const newspost = await NewsPost.findOne({slug});
        if(!newspost){
            throw 'News not found!';
        }
        res.json(newspost);
    } catch (err) {
        res.status(400).json({message: [err.toString()]});
    }
}

const deleteNewsPostByID = async (req, res, next) => {
    try {
        const newspostID = req.params.newspostID;
        const newspost = await NewsPost.findOne({_id: ObjectID(newspostID)});
        if(!newspost){
            throw 'News not found!';
        }
        await NewsPost.deleteOne({_id: ObjectID(newspostID)});
        res.json({ message: 'News successfully deleted!'});
    } catch (err) {
        res.status(400).json({message: [err.toString()]});
    }
};

const updateNewsPostByID = async (req, res, next) => {
    try{
        const newspost = req.body;
        const isNewspost = await NewsPost.findOne({_id: ObjectID(newspost._id)});
        if(!isNewspost){
            throw 'News not found!';
        }
        let newSlug = isNewspost.slug;
        newspost.contents.forEach(content => {
            if(content.languageCode == 'en'){
                const slug = Slug(content.title);
                if(newSlug !== slug){
                    newSlug = slug;
                }
            }
        });
        newspost.slug = newSlug;
        await NewsPost.updateOne(
            { _id: ObjectID(newspost._id) },
            {
                $set: newspost
            }
        )
        res.json({ message: 'News successfully updated!' });
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}


const getLatestNewsPosts = async (req, res, next) => {
    try{
        const sumNewsposts = await NewsPost.countDocuments();
        let latestNewspost = await NewsPost.find().sort({'updatedAt': -1}).limit(3);
        if(req.query.publish && req.query.limit){
            latestNewspost = await NewsPost.find({publish: req.query.publish}).sort({'createdAt': -1}).limit(Number(req.query.limit));
        }
        const data = {
            sumNewsposts,
            latestNewspost
        }
        res.json(data);
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

module.exports = {
    createNewsPost,
    getNewsPosts,
    deleteNewsPosts,
    createThumbnail,
    createImages,
    changeNewsPostToDraft,
    changeNewsPostToPublish,
    getNewsPostByID,
    getNewsPostBySlug,
    deleteNewsPostByID,
    updateNewsPostByID,
    getLatestNewsPosts,
    createVideos
}