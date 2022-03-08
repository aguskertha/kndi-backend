const app = require("../../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const Contact = require('./model');
const User = require('../user/model');
const mongoose = require('mongoose');
const port = process.env.db_port || 27018;
const databaseLocal = `mongodb://${process.env.db_service_name}:${port}/${process.env.db_name_test_contact}`;
const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE4NDY4ZjFiNDQ0NTAwMWY4ODUxNjIiLCJpYXQiOjE2NDY2NDY0NTYsImV4cCI6MTY0NjY0NjQ3Nn0.fZzkHzWGsvL8DlChwyISFxTYM7zN2pjxJahMV0QzKok";
const DUMMY_USER_ID = "621e3ee807fb490ad0208040";

beforeAll(async () => {
    await mongoose.connect(databaseLocal, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true 
    });
});

describe('POST /api/v1/contact/', function() {
    it('200 => Create new contact', async function() {
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        const response = await request.post('/api/v1/contact/').send(contact);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });
    it('400 => Bad Request create new contact', async function() {
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+62857366",
            message: "Semangat lah"
        }
        const response = await request.post('/api/v1/contact/').send(contact);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]))
        expect(response.status).toEqual(400);
    });
});
describe('POST /api/v1/contact/update', function() {
    it('200 => Update contact', async function() {
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        await request.post('/api/v1/contact/').send(contact);
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        const contactID = contactsResponse.body[0]._id;
        
        const newContact = {
            _id: contactID,
            name: "fuhaa",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        
        const updateResponse = await request.post('/api/v1/contact/update').set('Authorization', `Bearer ${token}`).send(newContact);
        expect(updateResponse.body.message).toEqual(expect.any(String));
        expect(updateResponse.status).toEqual(200);
    });
    it('400 => Bad Request when Update contact', async function() {
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        await request.post('/api/v1/contact/').send(contact);
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        const contactID = contactsResponse.body[0]._id;
        
        const newContact = {
            _id: contactID,
            name: "fuhaa",
            email: "fuuhagmail.com",
            phone: "+62857",
            message: "Semangat lah"
        }
        
        const updateResponse = await request.post('/api/v1/contact/update').set('Authorization', `Bearer ${token}`).send(newContact);
        expect(updateResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(updateResponse.status).toEqual(400);
    });
});

describe('GET /api/v1/contact/', () => {
    it('200 => Get Contacts', async () =>{
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        expect(contactsResponse.body).toEqual(expect.arrayContaining([]));
        expect(contactsResponse.status).toEqual(200);
    });
    it('401 => Auth fail when get contacts', async () =>{
        const token = DUMMY_TOKEN;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        expect(contactsResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(contactsResponse.status).toEqual(401);
    });
});

describe('GET /api/v1/contact/latest', () => {
    it('200 => Get Latest Contacts', async () =>{
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/latest').set('Authorization', `Bearer ${token}`);
        expect(contactsResponse.body).toEqual({
            latestContacts: expect.arrayContaining([]),
            sumContacts: expect.any(Number),
        });
        expect(contactsResponse.status).toEqual(200);
    });
    it('401 => Auth fail when Get Latest Contacts', async () =>{
        const token = DUMMY_TOKEN;
        const contactsResponse = await request.get('/api/v1/contact/latest').set('Authorization', `Bearer ${token}`);
        expect(contactsResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(contactsResponse.status).toEqual(401);
    });
});

describe('GET /api/v1/contact/:contactID', () => {
    it('200 => Get Contact By ID', async () =>{
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        await request.post('/api/v1/contact/').send(contact);
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        const contactID = contactsResponse.body[0]._id;
        const contactResponse = await request.get('/api/v1/contact/'+contactID).set('Authorization', `Bearer ${token}`);
        expect(contactResponse.status).toEqual(200)
    });
    it('401 => Auth fail when Get Contact By ID', async () =>{
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        await request.post('/api/v1/contact/').send(contact);
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        let token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        const contactID = contactsResponse.body[0]._id;
        token = DUMMY_TOKEN;
        const contactResponse = await request.get('/api/v1/contact/'+contactID).set('Authorization', `Bearer ${token}`);
        expect(contactResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(contactResponse.status).toEqual(401)
    });
});

describe('DELETE /api/v1/contact/:contactID', () => {
    it('200 => Delete Contact By ID', async () =>{
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        await request.post('/api/v1/contact/').send(contact);
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        const contactID = contactsResponse.body[0]._id;
        const contactResponse = await request.delete('/api/v1/contact/'+contactID).set('Authorization', `Bearer ${token}`);
        expect(contactResponse.body.message).toEqual(expect.any(String));
        expect(contactResponse.status).toEqual(200)
    });
    it('401 => Auth fail when Delete Contact By ID', async () =>{
        const contact = {
            name: "fuha",
            email: "fuuha@gmail.com",
            phone: "+6285736668877",
            message: "Semangat lah"
        }
        await request.post('/api/v1/contact/').send(contact);
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        let token = loginResponse.body.token;
        const contactsResponse = await request.get('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        const contactID = contactsResponse.body[0]._id;
        token = DUMMY_TOKEN;
        const contactResponse = await request.delete('/api/v1/contact/'+contactID).set('Authorization', `Bearer ${token}`);
        expect(contactResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(contactResponse.status).toEqual(401)
    });
});

describe('DELETE /api/v1/contact/', () => {
    it('200 => Delete Contacts', async () =>{
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const contactsResponse = await request.delete('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        expect(contactsResponse.body.message).toEqual(expect.any(String));
        expect(contactsResponse.status).toEqual(200);
    });
    it('401 => Auth fail when Delete Contacts', async () =>{
        const token = DUMMY_TOKEN;
        const contactsResponse = await request.delete('/api/v1/contact/').set('Authorization', `Bearer ${token}`);
        expect(contactsResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(contactsResponse.status).toEqual(401);
    });
});


afterEach(async () => {
    await Contact.deleteMany();
    await User.deleteMany();
});