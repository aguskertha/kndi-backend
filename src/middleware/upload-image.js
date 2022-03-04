const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const multiUploadFile = (req, res, next) => {
    const upload = multer({
        storage:storage,
        limits: {
            fileSize: 1024 * 1024 * 2
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
            fileSize: 1024 * 1024 * 2
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

module.exports = {singleUploadFile, multiUploadFile};