const app = require("../../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const User = require('./model');
const mongoose = require('mongoose');
const port = process.env.db_port || 27018;
const databaseLocal = `mongodb://${process.env.db_service_name}:${port}/${process.env.db_name_test_user}`;
const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE4NDY4ZjFiNDQ0NTAwMWY4ODUxNjIiLCJpYXQiOjE2NDY2NDY0NTYsImV4cCI6MTY0NjY0NjQ3Nn0.fZzkHzWGsvL8DlChwyISFxTYM7zN2pjxJahMV0QzKok";
const DUMMY_USER_ID = "621e3ee807fb490ad0208040";

beforeAll(async () => {
    await mongoose.connect(databaseLocal, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true 
    });
});

describe('POST /api/v1/user/register', function() {
  it('200 => Register with valid email and password', async function() {
    const response = await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    expect(response.body.message).toBe('User successfully added');
    expect(response.status).toEqual(200);
  });

  it('400 => Register with required email and password', async function() {
    const response = await request.post('/api/v1/user/register').send({email: '', password: ''});
    expect(response.body.message).toStrictEqual(["Email required!", "Password required!", "Invalid email format!"]);
    expect(response.status).toEqual(400);
  });

});

describe('POST /api/v1/user/login', () => {
  it('200 => Login with valid email and password',async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const response = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    expect(response.status).toEqual(200);
  });
  it('400 => Login with invalid user',async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const response = await request.post('/api/v1/user/login').send({email: 'segara@gmail.com', password: 'kertha123'});
    expect(response.body.message).toStrictEqual([ 'User not found!' ]);
    expect(response.status).toEqual(400);
  });
});

describe('POST /api/v1/user/token', () => {
  it('200 => Generate new token for auth',async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const refreshToken = loginResponse.body.refreshToken;
    const userID = loginResponse.body.userID;
    const response = await request.post('/api/v1/user/token').send({refreshToken, userID});
    expect(response.status).toEqual(200);
  });
  it('400 => Bad Request generate token',async () => {
    const response = await request.post('/api/v1/user/token').send({DUMMY_TOKEN, DUMMY_USER_ID});
    expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]))
    expect(response.status).toEqual(400);
  });
});

describe('POST /api/v1/user/reset-password', () => {
  it('200 => Reset password user', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const resetPass = {userID, password: 'kertha123', newPassword: 'kertha1234'};
    const userUpdateResponse = await request.post('/api/v1/user/reset-password').set('Authorization', `Bearer ${token}`).send(resetPass);
    expect(userUpdateResponse.status).toEqual(200);
  });
  it('401 => Failed Auth', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE4NDY4ZjFiNDQ0NTAwMWY4ODUxNjIiLCJpYXQiOjE2NDY2NDY0NTYsImV4cCI6MTY0NjY0NjQ3Nn0.fZzkHzWGsvL8DlChwyISFxTYM7zN2pjxJahMV0QzKok";
    const userID = loginResponse.body.userID;
    const resetPass = {userID, password: 'kertha1234', newPassword: 'kertha1234'};
    const userUpdateResponse = await request.post('/api/v1/user/reset-password').set('Authorization', `Bearer ${token}`).send(resetPass);
    expect(userUpdateResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]))
    expect(userUpdateResponse.status).toEqual(401);
  });
  it('400 => Invalid password', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const resetPass = {userID, password: 'kertha1234', newPassword: 'kertha1234'};
    const userUpdateResponse = await request.post('/api/v1/user/reset-password').set('Authorization', `Bearer ${token}`).send(resetPass);
    expect(userUpdateResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]))
    expect(userUpdateResponse.status).toEqual(400);
  });
});

describe('POST /api/v1/user/update', () => {
  it('200 => Update user', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const user = {_id: userID, name: 'bambang', email: 'kertha@gmail.co', password: 'kertha123'};
    const userUpdateResponse = await request.post('/api/v1/user/update').set('Authorization', `Bearer ${token}`).send({user});
    expect(userUpdateResponse.status).toEqual(200);
  });
  it('401 => Auth fail when update', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE4NDY4ZjFiNDQ0NTAwMWY4ODUxNjIiLCJpYXQiOjE2NDY2NDY0NTYsImV4cCI6MTY0NjY0NjQ3Nn0.fZzkHzWGsvL8DlChwyISFxTYM7zN2pjxJahMV0QzKok";
    const userID = loginResponse.body.userID;
    const user = {_id: userID, name: 'bambang', email: 'kertha@gmail.co', password: 'kertha123'};
    const userUpdateResponse = await request.post('/api/v1/user/update').set('Authorization', `Bearer ${token}`).send({user});
    expect(userUpdateResponse.status).toEqual(401);
  });
  it('400 => Bad Request when update', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const user = {_id: userID, name: 'bambang', email: '', password: ''};
    const userUpdateResponse = await request.post('/api/v1/user/update').set('Authorization', `Bearer ${token}`).send({user});
    expect(userUpdateResponse.body.message).toEqual(expect.arrayContaining([expect.any(String)]))
    expect(userUpdateResponse.status).toEqual(400);
  });
});

describe('GET /api/v1/user/', () => {
  it('200 => Get Users', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const usersResponse = await request.get('/api/v1/user/').set('Authorization', `Bearer ${token}`);
    expect(usersResponse.status).toEqual(200);
  });

  it('401 => Auth fail when get users', async () => {
    const usersResponse = await request.get('/api/v1/user/');
    expect(usersResponse.status).toEqual(401);
  });
});

describe('GET /api/v1/user/:userID', () => {
  it('200 => Get User By ID', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const usersResponse = await request.get('/api/v1/user/'+userID).set('Authorization', `Bearer ${token}`);
    expect(usersResponse.status).toEqual(200);
  });

  it('401 => Auth fail when get user by ID', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const userID = loginResponse.body.userID;
    const usersResponse = await request.get('/api/v1/user/'+userID);
    expect(usersResponse.status).toEqual(401);
  });
});

describe('DELETE /api/v1/user/', () => {
  it('200 => Delete Users', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const usersResponse = await request.delete('/api/v1/user/').set('Authorization', `Bearer ${token}`);
    expect(usersResponse.status).toEqual(200);
  });
  it('401 => Auth fail when delete users', async () => {
    const usersResponse = await request.delete('/api/v1/user/');
    expect(usersResponse.status).toEqual(401);
  });
});

describe('DELETE /api/v1/user/:userID', () => {
  it('200 => Delete User By ID', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const usersResponse = await request.delete('/api/v1/user/'+userID).set('Authorization', `Bearer ${token}`);
    expect(usersResponse.status).toEqual(200);
  });
  it('401 => Auth fail when delete users', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const userID = loginResponse.body.userID;
    const usersResponse = await request.delete('/api/v1/user/'+userID);
    expect(usersResponse.status).toEqual(401);
  });
  it('400 => Bad Request when Delete User By ID', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = "621e3ee807fb490ad0208040";
    const usersResponse = await request.delete('/api/v1/user/'+userID).set('Authorization', `Bearer ${token}`);
    expect(usersResponse.status).toEqual(400);
  });
});

describe('DELETE /api/v1/user/logout', () => {
  it('200 => Logout user', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = loginResponse.body.token;
    const userID = loginResponse.body.userID;
    const usersResponse = await request.delete('/api/v1/user/logout').set('Authorization', `Bearer ${token}`).send(userID);
    expect(usersResponse.status).toEqual(200);
  });
  it('401 => Auth fail when logout', async () => {
    await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE4NDY4ZjFiNDQ0NTAwMWY4ODUxNjIiLCJpYXQiOjE2NDY2NDY0NTYsImV4cCI6MTY0NjY0NjQ3Nn0.fZzkHzWGsvL8DlChwyISFxTYM7zN2pjxJahMV0QzKok";
    const userID = loginResponse.body.userID;
    const usersResponse = await request.delete('/api/v1/user/logout').set('Authorization', `Bearer ${token}`).send(userID);
    expect(usersResponse.status).toEqual(401);
  });
});

afterEach(async () => {
  await User.deleteMany();
});