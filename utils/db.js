const mongoose = require('mongoose');
const database = process.env.MONGO_URI;
const databaseLocal = process.env.MONGO_LOCAL;

mongoose.connect(databaseLocal, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});

mongoose.connection.on('connected', () => {
    console.log(`${databaseLocal}: Connected...`);
});
