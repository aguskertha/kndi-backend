const Contact = require('./model');
const ObjectID = require('mongodb').ObjectId;

const createContact = async (req,res,next) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const message = req.body.message;

        const newContact = new Contact({name, email, phone, message});
        await newContact.save();
        res.json({message: 'Contact successfully created!'});
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const getContacts = async (req,res,next) => {
    const contacts = await Contact.find().sort({'createdAt': -1});
    res.json(contacts);
}

const updateContactByID = async (req, res, next) => {
    try{
        const _id = req.body._id;
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const message = req.body.message;
        const contact = {_id, name, email, phone, message};
        const isContact = await Contact.findOne({_id: ObjectID(contact._id)});
        if(!isContact){
            throw 'Contact not found!';
        }
        await Contact.updateOne(
            { _id: ObjectID(contact._id) },
            {
                $set: contact
            }
        )
        res.json({ message: 'Contact successfully updated!' });
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const getContactByID = async (req, res, next) => {
    try{
        const contactID = req.params.contactID;
        const contact = await Contact.findOne({_id: ObjectID(contactID)});
        if(!contact){
            throw 'Contact not found!';
        }
        res.json(contact);
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const deleteContactByID = async (req, res, next) => {
    try{
        const contactID = req.params.contactID;
        const contact = await Contact.findOne({_id: ObjectID(contactID)});
        if(!contact){
            throw 'Contact not found!';
        }
        await Contact.deleteOne({_id: ObjectID(contactID)});
        res.json({ message: 'Contact successfully deleted!'});
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const deleteContacts = async (req, res, next) => {
    try{
        await Contact.deleteMany();
        res.json({message: 'Contacts successfully deleted!'})
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

const getLatestContacts = async (req, res, next) => {
    try{
        const sumContacts = await Contact.countDocuments();
        const latestContacts = await Contact.find().sort({'updatedAt': -1}).limit(3);
        const data = {
            sumContacts,
            latestContacts
        }
        res.json(data);
    }
    catch(err){
        res.status(400).json({message: [err.toString()]});
    }
}

module.exports = {
    createContact,
    getContacts,
    updateContactByID,
    getContactByID,
    deleteContactByID,
    deleteContacts,
    getLatestContacts
}