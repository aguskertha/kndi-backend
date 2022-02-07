const mongoose = require('mongoose');
const database = process.env.MONGO_URI;
const port = process.env.db_port || 27017;
const databaseLocal = 'mongodb://localhost:27017/kndiDB' || `mongodb://${process.env.db_service_name}:${port}/${process.env.db_name}`;

mongoose.connect(databaseLocal, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});

mongoose.connection.on('connected', () => {
    console.log(`${databaseLocal}: Connected...`);
});
