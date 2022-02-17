const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/');
    },
    filename: function(req, file, cb){
        const fileName = file.originalname.replace(/\s/g, '');
        cb(null, new Date().toISOString().replace(/:/g, '-')+'-'+fileName.toLowerCase());
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const uploadFile = (req, res, next) => {
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

module.exports = uploadFile;