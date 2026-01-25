const express = require('express');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./database/db');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));
app.get('/api-test', (req, res) => res.sendFile(path.join(__dirname, 'views', 'api-test.html')));
app.get('/search', (req, res) => {
    if (!req.query.q) return res.status(400).send("Missing search query");
    res.sendFile(path.join(__dirname, 'views', 'search.html'));
});
app.get('/item/:id', (req, res) => res.sendFile(path.join(__dirname, 'views', 'item.html')));


app.post('/contact', (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).send("Name and message are required");

    const filePath = path.join(__dirname, 'data', 'contacts.json');
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]') : [];
    data.push({ name, message, date: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.send(`<h2>Message sent!</h2><a href="/">Back</a>`);
});


app.use('/api/notes', notesRouter);


app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

async function startServer() {
    try {
       
        await connectDB();
        
      
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API available at http://localhost:${PORT}/api/notes`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();