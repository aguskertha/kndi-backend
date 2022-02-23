
const createNewsPostValidation = async (req, res, next) => {
    let errors = [];
    const thumbnailURL = req.body.thumbnailURL;
    const contents = req.body.contents;

    if (thumbnailURL == '') {
        errors.push('Thumbnail URL required!');
    }
    if (contents) {
        if(contents.length == 0){
            errors.push('Contents required!');
        }
    }
    
    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const updateNewsPostByIDValidation = async (req, res, next) => {
    let errors = [];
    const newspost = req.body;
    const contents = newspost.contents;
    const publish = newspost.publish;
    const publishDate = newspost.publishDate;

    if (contents) {
        if(contents.length == 0){
            errors.push('Contents required!');
        }
    }
    if(publishDate !== '-'){
        errors.push('Publish Date cannot changed manually!');
    }
    if(publish !== 0){
        errors.push('Change news to draft first!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

module.exports = {
    createNewsPostValidation,
    updateNewsPostByIDValidation
}