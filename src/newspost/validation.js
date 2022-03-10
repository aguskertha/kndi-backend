
const createNewsPostValidation = async (req, res, next) => {
    let errors = [];
    const contents = req.body.contents;

    if (contents) {
        if(contents.length == 0){
            errors.push('Contents required!');
        }
    }
    else{
        contents.forEach(content => {
            if(content.title){
                if(content.title == ''){
                    errors.push('Content title required!');
                }
            }
            else{
                errors.push('Content title required!');
            }
            if(content.languageCode){
                if(content.languageCode == ''){
                    errors.push('Content languageCode required!');
                }
            }
            else{
                errors.push('Content languageCode required!');
            }
        });
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
    const publishDate = newspost.publishDate;

    if (contents) {
        if(contents.length == 0){
            errors.push('Contents required!');
        }
        else{
            contents.forEach(content => {
                if(content.title){
                    if(content.title == ''){
                        errors.push('Content title required!');
                    }
                }
                else{
                    errors.push('Content title required!');
                }
                if(content.languageCode){
                    if(content.languageCode == ''){
                        errors.push('Content languageCode required!');
                    }
                }
                else{
                    errors.push('Content languageCode required!');
                }
            });
        }
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