const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// require('dotenv').config();

let _db;
// CuFZvsz9hYgUXUB2
const mongoConnect = (callback) => {
    MongoClient.connect(
        `mongodb+srv://sps398:CuFZvsz9hYgUXUB2@cluster0.tuxrxta.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(client => {
        console.log('connected to mongodb...');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

const getDb = () => {
    if(_db) {
        return _db;
    }

    throw 'No database found';
}

module.exports = {
    mongoConnect,
    getDb
}