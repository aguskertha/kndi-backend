const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {
    login,
    register,
    newToken,
    resetPassword,
    getUsers,
    getUserByID,
    updateUserByID,
    deleteUserByID,
    deleteUsers,
    logout
} = require('./controller');
const {
    registerValidation,
    loginValidation,
    tokenValidation,
    resetPasswordValidation,
    getUserByIDValidation,
    updateUserByIDValidation,
    deleteUserByIDValidation,
} = require('./validation');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/token', tokenValidation, newToken);
router.delete('/logout', authenticate, logout);
router.post('/reset-password', [authenticate, resetPasswordValidation], resetPassword);
router.post('/update', [authenticate, updateUserByIDValidation], updateUserByID);
router.get('/:userID', [authenticate, getUserByIDValidation], getUserByID);
router.delete('/:userID', [authenticate, deleteUserByIDValidation], deleteUserByID);
router.get('/', authenticate, getUsers);
router.delete('/', authenticate, deleteUsers);

module.exports = router;


/**
 * @swagger
 * tags:
 *  name: User
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: String
 *                  description: The user email
 *              password:
 *                  type: String
 *                  description: The user password
 *          example:
 *              email: diwanganteng@gmail.com
 *              password: diwan123
 *      Token:
 *          type: object
 *          required:
 *              - userID
 *              - refreshToken
 *          properties:
 *              userID:
 *                  type: String
 *                  description: The user _id
 *              refreshToken:
 *                  type: String
 *                  description: The user refresh token while login
 *          example:
 *              userID: 61fb84e2ad7b872af0f74638
 *              refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MWZiODRlMmFkN2I4NzJhZjBmNzQ2MzgiLCJpYXQiOjE2NDM4NzUwMDR9.mQRaSdUT_UbOO-M1XFU4ozp3Gek-ReKZFqHyHMSADQA
 *  securitySchemes:
 *      bearerAuth:            # arbitrary name for the security scheme
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT      
 */


/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *      summary: Login
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The User successfully login
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *      summary: Register
 *      tags: [User]
 *      security:
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The User successfully created
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/user/token:
 *  post:
 *      summary: Get new Token for Auth
 *      tags: [User]
 *      security:
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Token'
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Token'
 *      responses:
 *          200:
 *              description: The Token successfully generated
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/user/reset-password:
 *  post:
 *      summary: Reset Password
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userID:
 *                              type: string
 *                          newPassword:
 *                              type: string
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userID:
 *                              type: string
 *                          newPassword:
 *                              type: string
 *      responses:
 *          200:
 *              description: The Password successfully changed
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/user/update:
 *  post:
 *      summary: Update User By ID
 *      tags: [User]
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
 *                          name:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                          name:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: The User successfully updated
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/user/:
 *  get:
 *      summary: Get All User
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully get all Users
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/user/{userID}:
 *  get:
 *      summary: Get User By ID
 * 
 *      tags: [User]
 *      parameters:
 *          -   in: path
 *              name: userID
 *              schema:
 *                  type: string
 *              required: true
 *              description: String with length 24 char of the user to get
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The User successfully found!
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/user/logout:
 *  delete:
 *      summary: Logout
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userID:
 *                              type: string
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userID:
 *                              type: string
 *      responses:
 *          200:
 *              description: The User successfully logout
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/user/{userID}:
 *  delete:
 *      summary: Delete User By ID
 * 
 *      tags: [User]
 *      parameters:
 *          -   in: path
 *              name: userID
 *              schema:
 *                  type: string
 *              required: true
 *              description: String with length 24 char of the user to get
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The User successfully found!
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/user/:
 *  delete:
 *      summary: Delete All User
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The User successfully found!
 *          400:
 *              description: Something wrong!
 */
