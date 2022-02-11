const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {
    createContact,
    getContacts,
    updateContactByID,
    getContactByID,
    deleteContactByID,
    deleteContacts
} = require('./controller');
const {
    createContactValidation,
    updateContactByIDValidation
} = require('./validation');

router.post('/', createContactValidation, createContact);
router.get('/', authenticate, getContacts);
router.delete('/', authenticate, deleteContacts);
router.post('/update', [authenticate, updateContactByIDValidation], updateContactByID);
router.get('/:contactID', authenticate, getContactByID);
router.delete('/:contactID', authenticate, deleteContactByID);

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
 *      Contact:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - phone
 *              - company
 *              - message
 *          properties:
 *              name:
 *                  type: String
 *                  description: The contact name
 *              email:
 *                  type: String
 *                  description: The contact email
 *              phone:
 *                  type: String
 *                  description: The contact phone
 *              company:
 *                  type: String
 *                  description: The contact company
 *              message:
 *                  type: String
 *                  description: The contact message 
 *          example:
 *              name: Putu Bagus Kertha Segara
 *              email: kertha@gmail.com
 *              phone: '+6285738877999'
 *              company: PT Merdeka Selalu
 *              message: Mantap aja sih
 *  securitySchemes:
 *      bearerAuth:            # arbitrary name for the security scheme
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT      
 */

/**
 * @swagger
 * /api/v1/contact/:
 *  post:
 *      summary: Create Contact
 *      tags: [Contact]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Contact'
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Contact'
 *      responses:
 *          200:
 *              description: The Contact successfully created
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/contact/:
 *  get:
 *      summary: Get All Contacts
 *      tags: [Contact]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully get all Contacts
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/contact/update:
 *  post:
 *      summary: Update Contact By ID
 *      tags: [Contact]
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
 *                          phone:
 *                              type: string
 *                          company:
 *                              type: string
 *                          message:
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
 *                          phone:
 *                              type: string
 *                          company:
 *                              type: string
 *                          message:
 *                              type: string
 *      responses:
 *          200:
 *              description: The Contact successfully updated
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/contact/{contactID}:
 *  get:
 *      summary: Get Contact By ID
 *      tags: [Contact]
 *      parameters:
 *          -   in: path
 *              name: contactID
 *              schema:
 *                  type: string
 *              required: true
 *              description: String with length 24 char of the contact to get
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The Contact successfully found!
 *          400:
 *              description: Something wrong!
 */


/**
 * @swagger
 * /api/v1/contact/{contactID}:
 *  delete:
 *      summary: Delete Contact By ID
 *      tags: [Contact]
 *      parameters:
 *          -   in: path
 *              name: contactID
 *              schema:
 *                  type: string
 *              required: true
 *              description: String with length 24 char of the contact to get
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The Contact successfully found!
 *          400:
 *              description: Something wrong!
 */

/**
 * @swagger
 * /api/v1/contact/:
 *  delete:
 *      summary: Delete All Contacts
 *      tags: [Contact]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The Contacts successfully deleted!
 *          400:
 *              description: Something wrong!
 */


