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
    getNewsPostBySlug,
    deleteNewsPostByID,
    updateNewsPostByID,
    getLatestNewsPosts
} = require('./controller');
const {
    createNewsPostValidation,
    updateNewsPostByIDValidation
} = require('./validation');

router.post('/', createNewsPostValidation, createNewsPost);
router.get('/', getNewsPosts);
router.get('/latest', getLatestNewsPosts);
router.delete('/', deleteNewsPosts);
router.get('/:slug', getNewsPostBySlug);
router.delete('/:newspostID', deleteNewsPostByID);
router.post('/update', updateNewsPostByIDValidation, updateNewsPostByID);
router.post('/publish', changeNewsPostToPublish);
router.post('/draft', changeNewsPostToDraft);
router.post('/uploadthumbnail', singleUploadFile, createThumbnail);
router.post('/uploadimages', multiUploadFile, createImages);

module.exports = router;


/**
 * @swagger
 * tags:
 *  name: Contact
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      NewsPost:
 *          type: object
 *          required:
 *              - thumbnailURL
 *              - contents
 *          properties:
 *              thumbnailURL:
 *                  type: String
 *                  description: The content thumbnail
 *              contents:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: String
 *                          languageCode:
 *                              type: String
 *                          data:
 *                              type: String
 *  securitySchemes:
 *      bearerAuth:            # arbitrary name for the security scheme
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT      
 */

/**
 * @swagger
 * /api/v1/newspost/:
 *  post:
 *      summary: Create NewsPost
 *      tags: [NewsPost]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/NewsPost'
 *      responses:
 *          200:
 *              description: The News successfully created
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/newspost/:
 *  get:
 *      summary: Get All News
 *      tags: [NewsPost]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully get all News
 *          400:
 *              description: Something wrong!
 */
