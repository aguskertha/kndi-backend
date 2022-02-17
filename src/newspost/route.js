const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const uploadFile = require('./../middleware/upload-file');

const {
    createNewsPost,
    getNewsPosts,
    deleteNewsPosts,
    createFile
} = require('./controller');
const {
    createNewsPostValidation
} = require('./validation');

router.post('/', createNewsPost);
router.get('/', getNewsPosts);
router.delete('/', deleteNewsPosts);
router.post('/uploadfile', uploadFile, createFile);

module.exports = router;