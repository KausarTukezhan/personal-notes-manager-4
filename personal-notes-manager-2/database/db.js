const { MongoClient } = require('mongodb');


const uri = 'mongodb://localhost:27017';
const dbName = 'notesManager';

let db = null;
let client = null;


async function connectDB() {
    if (db) {
        return db;
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log('✓ Connected to MongoDB successfully');
        return db;
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        throw error;
    }
}


function getDB() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db;
}


async function closeDB() {
    if (client) {
        await client.close();
        db = null;
        client = null;
        console.log('✓ MongoDB connection closed');
    }
}

module.exports = {
    connectDB,
    getDB,
    closeDB
};
