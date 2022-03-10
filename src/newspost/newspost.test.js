const app = require("../../app"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const NewsPost = require('./model');
const User = require('../user/model');
const mongoose = require('mongoose');
const port = process.env.db_port || 27018;
const databaseLocal = `mongodb://${process.env.db_service_name}:${port}/${process.env.db_name_test_newspost}`;
const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MjE4NDY4ZjFiNDQ0NTAwMWY4ODUxNjIiLCJpYXQiOjE2NDY2NDY0NTYsImV4cCI6MTY0NjY0NjQ3Nn0.fZzkHzWGsvL8DlChwyISFxTYM7zN2pjxJahMV0QzKok";
const DUMMY_USER_ID = "621e3ee807fb490ad0208040";
const DUMMY_NEWSPOST_ID = "621e3ee807fb490ad0208000";

beforeAll(async () => {
    await mongoose.connect(databaseLocal, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true 
    });
});

describe('POST /api/v1/newspost/', function() {
    it('200 => Create new NewsPost', async function() {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        const response = await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });

    it('401 => Auth fail when Create new NewsPost', async function() {
        const token = DUMMY_TOKEN;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        const response = await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(401);
    });

    it('400 => Bad Request when Create new NewsPost', async function() {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "",
                    languageCode: "",
                    data : "fuhaa"
                },
                {
                    title : "",
                    languageCode: "",
                    data : "fuhaaha"
                }
            ]
        }
        const response = await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(400);
    });
});

describe('POST /api/v1/newspost/update', function() {
    it('200 => Update NewsPost', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        const newNewspost = {
            _id: newspostID,
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang banyak",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy a lot of cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        const response = await request.post('/api/v1/newspost/update').set('Authorization', `Bearer ${token}`).send(newNewspost);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });
    it('401 => Auth fail when Update NewsPost', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        let token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        const newNewspost = {
            _id: newspostID,
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang banyak",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy a lot of cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        token = DUMMY_TOKEN;
        const response = await request.post('/api/v1/newspost/update').set('Authorization', `Bearer ${token}`).send(newNewspost);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(401);
    });
    it('400 => Bad Request when Update NewsPost', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        const newNewspost = {
            _id: newspostID,
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "",
                    languageCode: "",
                    data : "fuhaa"
                },
                {
                    title : "",
                    languageCode: "",
                    data : "fuhaaha"
                }
            ]
        }
        const response = await request.post('/api/v1/newspost/update').set('Authorization', `Bearer ${token}`).send(newNewspost);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(400);
    });
});

describe('POST /api/v1/newspost/publish', function() {
    it('200 => Publish newspost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        const response = await request.post('/api/v1/newspost/publish').set('Authorization', `Bearer ${token}`).send({newspostID});
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });
    it('401 => Auth fail when Publish newspost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        let token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        token = DUMMY_TOKEN;
        const response = await request.post('/api/v1/newspost/publish').set('Authorization', `Bearer ${token}`).send({newspostID});
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(401);
    });
    it('400 => Bad Request when Publish newspost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspostID = DUMMY_NEWSPOST_ID
        const response = await request.post('/api/v1/newspost/publish').set('Authorization', `Bearer ${token}`).send({newspostID});
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(400);
    });
});

describe('POST /api/v1/newspost/draft', function() {
    it('200 => Draft newspost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        const response = await request.post('/api/v1/newspost/draft').set('Authorization', `Bearer ${token}`).send({newspostID});
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });
    it('401 => Auth fail when Draft newspost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        let token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        token = DUMMY_TOKEN;
        const response = await request.post('/api/v1/newspost/draft').set('Authorization', `Bearer ${token}`).send({newspostID});
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(401);
    });
    it('400 => Bad Request when Draft newspost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspostID = DUMMY_NEWSPOST_ID
        const response = await request.post('/api/v1/newspost/draft').set('Authorization', `Bearer ${token}`).send({newspostID});
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(400);
    });
});

describe('GET /api/v1/newspost/', function() {
    it('200 => Get NewsPosts', async () => {
        const response = await request.get('/api/v1/newspost/');
        expect(response.body.message).toEqual(expect.arrayContaining([]));
        expect(response.status).toEqual(200);
    });
});

describe('GET /api/v1/newspost?publish=1', function() {
    it('200 => Get Published NewsPosts', async () => {
       const response = await request.get('/api/v1/newspost?publish=1');
       expect(response.body.message).toEqual(expect.arrayContaining([]));
       expect(response.status).toEqual(200);
    });
});

describe('GET /api/v1/newspost/latest', function() {
    it('200 => Get latest NewsPosts', async () => {
        const response = await request.get('/api/v1/newspost/latest');
        expect(response.body.message).toEqual(expect.arrayContaining([]));
        expect(response.status).toEqual(200);
    });
});

describe('GET /api/v1/newspost/latest?publish=1&limit=4', function() {
    it('200 => Get published and limit 4 latest NewsPosts ', async () => {
        const response = await request.get('/api/v1/newspost/latest?publish=1&limit=4');
        expect(response.body.message).toEqual(expect.arrayContaining([]));
        expect(response.status).toEqual(200);
    });
});

describe('GET /api/v1/newspost/:slug', function() {
    it('200 => Get NewsPosts by Slug ', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const slug = getResponse.body[0].slug;
        const response = await request.get('/api/v1/newspost/'+slug);
        expect(response.status).toEqual(200);
    });
    it('400 => Bad Request when Get NewsPosts by Slug', async () => {
        const slug = 'haa';
        const response = await request.get('/api/v1/newspost/'+slug);
        expect(response.body.message).toEqual(expect.arrayContaining([]));
        expect(response.status).toEqual(400);
    });
});

describe('DELETE /api/v1/newspost/:newspostID', function() {
    it('200 => Delete NewsPost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        const response = await request.delete('/api/v1/newspost/'+newspostID).set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });

    it('401 => Auth fail when Delete NewsPost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        let token = loginResponse.body.token;
        const newspost = {
            thumbnailURL: '2022-02-23T05-56-21.385Z-default-image-thumbnail.webp',
            contents : [
                {
                    title : "Diwan beli cupang",
                    languageCode: "id",
                    data : "fuhaa"
                },
                {
                    title : "Diwan buy cupang",
                    languageCode: "en",
                    data : "fuhaaha"
                }
            ]
        }
        await request.post('/api/v1/newspost/').set('Authorization', `Bearer ${token}`).send(newspost);
        const getResponse = await request.get('/api/v1/newspost/');
        const newspostID = getResponse.body[0]._id;
        token = DUMMY_TOKEN;
        const response = await request.delete('/api/v1/newspost/'+newspostID).set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(401);
    });
    it('400 => Bad Request when Delete NewsPost by ID', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const newspostID = DUMMY_NEWSPOST_ID;
        const response = await request.delete('/api/v1/newspost/'+newspostID).set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(400);
    });
});

describe('DELETE /api/v1/newspost/', function() {
    it('200 => Delete NewsPost', async () => {
        await request.post('/api/v1/user/register').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const loginResponse = await request.post('/api/v1/user/login').send({email: 'kertha@gmail.com', password: 'kertha123'});
        const token = loginResponse.body.token;
        const response = await request.delete('/api/v1/newspost/').set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toEqual(expect.any(String));
        expect(response.status).toEqual(200);
    });
    it('401 => Auth fail when Delete NewsPost', async () => {
        const token = DUMMY_TOKEN;
        const response = await request.delete('/api/v1/newspost/').set('Authorization', `Bearer ${token}`);
        expect(response.body.message).toEqual(expect.arrayContaining([expect.any(String)]));
        expect(response.status).toEqual(401);
    });
});



afterEach(async () => {
    await NewsPost.deleteMany();
    await User.deleteMany();
});