const multer = require('multer');
// const storage = multer.memoryStorage();
const moment = require('moment');

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'video/mp4'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/videos/');
    },
    filename: function(req, file, cb){
        const fileName = file.originalname.replace(/\s/g, '');
        const date = moment().format('YYYY-MM-DD-hh-mm-ss');
        const ref = date+'-'+fileName.toLowerCase();
        cb(null, ref);
    }
});

const multiUploadFileVideos = (req, res, next) => {
    const upload = multer({
        storage:storage,
        limits: {
            fileSize: 1024 * 1024 * 100
        },
        fileFilter: fileFilter
    });
    const uploadMultiple = upload.fields([{ name: 'files', maxCount: 10 }]);

    uploadMultiple(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({message: [err.toString()]});
        } else if (err) {
            return res.status(400).json({message: [err.toString()]});
        }
        next()
    })
}

const singleUploadFile = (req, res, next) => {
    const upload = multer({
        storage:storage,
        limits: {
            fileSize: 1024 * 1024 * 100
        },
        fileFilter: fileFilter
    }).single('file');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({message: [err.toString()]});
        } else if (err) {
            return res.status(400).json({message: [err.toString()]});
        }
        next()
    })
}

module.exports = {singleUploadFile, multiUploadFileVideos};