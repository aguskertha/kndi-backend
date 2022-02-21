const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {singleUploadFile, multiUploadFile} = require('./../middleware/upload-file');

const {
    createNewsPost,
    getNewsPosts,
    deleteNewsPosts,
    createThumbnail,
    createImages,
    changeNewsPostToDraft,
    changeNewsPostToPublish,
    getNewsPostByID,
    deleteNewsPostByID,
    updateNewsPostByID
} = require('./controller');
const {
    createNewsPostValidation,
    updateNewsPostByIDValidation
} = require('./validation');

router.post('/', createNewsPostValidation, createNewsPost);
router.get('/', getNewsPosts);
router.delete('/', deleteNewsPosts);
router.get('/:newspostID', getNewsPostByID);
router.delete('/:newspostID', deleteNewsPostByID);
router.post('/update', updateNewsPostByIDValidation, updateNewsPostByID);
router.post('/publish', changeNewsPostToPublish);
router.post('/draft', changeNewsPostToDraft);
router.post('/uploadthumbnail', singleUploadFile, createThumbnail);
router.post('/uploadimages', multiUploadFile, createImages);

module.exports = router;