const validator = require('validator');

const isValidPhoneNumber = [
    'id-ID', 'en-AU', 'en-BM', 'en-BW', 'en-CA', 'en-GB', 
    'en-GG', 'en-GH', 'en-GY', 'en-HK', 'en-MO', 'en-IE', 
    'en-IN', 'en-KE', 'en-KI', 'en-MT', 'en-MU', 'en-NG', 
    'en-NZ', 'en-PK', 'en-PH', 'en-RW', 'en-SG', 'en-SL', 
    'en-UG', 'en-US', 'en-TZ', 'en-ZA', 'en-ZM', 'en-ZW'
]

const createContactValidation = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const company = req.body.company;
    const message = req.body.message;
    let errors = [];
    if (name == '') {
        errors.push('Name required!');
    }
    if (email == '') {
        errors.push('Email required!');
    }
    if (phone == '') {
        errors.push('Phone required!');
    }
    if (company == '') {
        errors.push('Company required!');
    }
    if (message == '') {
        errors.push('Message required!');
    }
    if (!validator.isEmail(email)) {
        errors.push('Invalid email format!');
    }
    if (!validator.isMobilePhone(phone, isValidPhoneNumber)) {
        errors.push('Invalid phone format!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

const updateContactByIDValidation = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const company = req.body.company;
    const message = req.body.message;
    let errors = [];
    if (name == '') {
        errors.push('Name required!');
    }
    if (email == '') {
        errors.push('Email required!');
    }
    if (phone == '') {
        errors.push('Phone required!');
    }
    if (company == '') {
        errors.push('Company required!');
    }
    if (message == '') {
        errors.push('Message required!');
    }
    if (!validator.isEmail(email)) {
        errors.push('Invalid email format!');
    }
    if (!validator.isMobilePhone(phone, isValidPhoneNumber)) {
        errors.push('Invalid phone format!');
    }

    if (errors.length == 0) {
        next();
    }
    else {
        res.status(400).json({ message: errors });
    }
}

module.exports = {
    createContactValidation,
    updateContactByIDValidation
}