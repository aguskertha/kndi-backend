const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {singleUploadFile, multiUploadFile} = require('../middleware/upload-image');
const {multiUploadFileVideos} = require('../middleware/upload-video');

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
    getLatestNewsPosts,
    createVideos
} = require('./controller');
const {
    createNewsPostValidation,
    updateNewsPostByIDValidation
} = require('./validation');

router.post('/', authenticate, createNewsPostValidation, createNewsPost);
router.get('/', getNewsPosts);
router.get('/latest', getLatestNewsPosts);
router.delete('/', authenticate, deleteNewsPosts);
router.get('/:slug', getNewsPostBySlug);
router.delete('/:newspostID', authenticate, deleteNewsPostByID);
router.post('/update', authenticate, updateNewsPostByIDValidation, updateNewsPostByID);
router.post('/publish', authenticate, changeNewsPostToPublish);
router.post('/draft', authenticate, changeNewsPostToDraft);
router.post('/uploadthumbnail', authenticate, singleUploadFile, createThumbnail);
router.post('/uploadimages', authenticate, multiUploadFile, createImages);
router.post('/uploadvideos', authenticate, multiUploadFileVideos, createVideos);

module.exports = router;


/**
 * @swagger
 * tags:
 *  name: NewsPost
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
 *      security:
 *        - bearerAuth: []
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
 *      responses:
 *          200:
 *              description: Successfully get all News
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/{slug}:
 *  get:
 *      summary: Get News By Slug
 *      tags: [NewsPost]
 *      parameters:
 *          -   in: path
 *              name: slug
 *              schema:
 *                  type: string
 *              required: true
 *      responses:
 *          200:
 *              description: The News successfully found!
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/latest:
 *  get:
 *      summary: Get Latest News
 *      tags: [NewsPost]
 *      responses:
 *          200:
 *              description: Successfully get latest News
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/update:
 *  post:
 *      summary: Update News By ID
 *      tags: [NewsPost]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                          thumbnailURL:
 *                              type: string
 *                          contents:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      title:
 *                                          type: String
 *                                      languageCode:
 *                                          type: String
 *                                      data:
 *                                          type: String
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                          thumbnailURL:
 *                              type: string
 *                          contents:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      title:
 *                                          type: String
 *                                      languageCode:
 *                                          type: String
 *                                      data:
 *                                          type: String
 *      responses:
 *          200:
 *              description: The News successfully updated
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/publish:
 *  post:
 *      summary: Change News to Publish
 *      tags: [NewsPost]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          newspostID:
 *                              type: string
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          newspostID:
 *                              type: string
 *      responses:
 *          200:
 *              description: The News successfully published
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/draft:
 *  post:
 *      summary: Change News to Draft
 *      tags: [NewsPost]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          newspostID:
 *                              type: string
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          newspostID:
 *                              type: string
 *      responses:
 *          200:
 *              description: The News successfully drafted
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/newspost/uploadthumbnail:
 *  post:
 *      summary: Upload Thumbnail file
 *      tags: [NewsPost]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The Thumbnail Image successfully uploaded
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/uploadimages:
 *  post:
 *      summary: Upload Multiple Images file
 *      tags: [NewsPost]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          files:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  format: binary
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The Images successfully uploaded
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/newspost/{newspostID}:
 *  delete:
 *      summary: Delete News By ID
 *      tags: [NewsPost]
 *      parameters:
 *          -   in: path
 *              name: newspostID
 *              schema:
 *                  type: string
 *              required: true
 *              description: String with length 24 char of the news to get
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The News successfully deleted!
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/newspost/:
 *  delete:
 *      summary: Delete All News
 *      tags: [NewsPost]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The News successfully deleted!
 *          400:
 *              description: Something wrong!
 */
