require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./database/db');

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'golden-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 день
        httpOnly: true,
        secure: false 
    }
}));

app.use('/api/notes', require('./routes/notes'));
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});
app.use('/api/auth', require('./routes/auth'));

app.post('/api/contact', (req, res) => {
    console.log("Получен запрос на контакт:", req.body); 
    
    try {
        const { email, message } = req.body;
        if (!email || !message) {
            return res.status(400).json({ error: "Email and message are required" });
        }

        const dirPath = path.join(__dirname, 'data');
        const filePath = path.join(dirPath, 'contacts.json');

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(" Папка 'data' создана");
        }

        let contacts = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            try {
                contacts = JSON.parse(fileContent || "[]");
            } catch (e) {
                contacts = []; 
            }
        }

        contacts.push({
            email,
            message,
            date: new Date().toLocaleString()
        });

        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
        console.log("✅ Сообщение сохранено в data/contacts.json");
        
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Ошибка сервера:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
});