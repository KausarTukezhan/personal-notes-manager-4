const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI; 
const dbName = 'personal-notes-manager';

let db = null;
let client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        db = client.db(dbName);
    
        await db.collection('users').createIndex({ "email": 1 }, { unique: true });
        
        console.log('✅ Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('❌ Connection error:', error.message);
        process.exit(1);
    }
}

function getDb() {
    if (!db) throw new Error('DB not initialized');
    return db;
}

module.exports = { connectDB, getDb, getDB: getDb };