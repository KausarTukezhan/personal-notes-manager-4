require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db(); 
        const users = db.collection('users');

        const adminEmail = "admin@gold.com"; 
        const adminPass = "admin123";       

        const exists = await users.findOne({ email: adminEmail });
        if (exists) {
            console.log("Admin already exists!");
            return;
        }

        const hashedPass = await bcrypt.hash(adminPass, 10);
        await users.insertOne({
            email: adminEmail,
            password: hashedPass,
            role: 'admin',
            createdAt: new Date()
        });

        console.log("✨ Admin created successfully!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPass}`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

createAdmin();