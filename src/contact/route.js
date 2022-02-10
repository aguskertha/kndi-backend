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
router.get('/', getContacts);
router.delete('/', deleteContacts);
router.post('/update', updateContactByIDValidation, updateContactByID);
router.get('/:contactID', getContactByID);
router.delete('/:contactID', deleteContactByID);

module.exports = router;