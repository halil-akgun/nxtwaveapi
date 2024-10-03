const { MongoClient } = require('mongodb');

let dbConnection;

let uri = 'mongodb://0.0.0.0:27017/dbnxtwave'; // 0.0.0.0 is localhost

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(uri)
            .then(client => {
                dbConnection = client.db();
                return callback();
            })
            .catch(err => {
                console.log(err);
                return callback(err);
            })
    },

    getDb: () => dbConnection
}

