const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const { getDb } = require('../database/db'); 

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }
        // Проверка пароля (не только длина, но и отсутствие пустоты)
        if (!password || password.trim().length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const db = getDb();
        const hash = await bcrypt.hash(password, 10);
        
        await db.collection('users').insertOne({ 
            email: email.toLowerCase().trim(),
            password: hash, 
            role: 'user',
            createdAt: new Date()
        });

        res.status(201).json({ message: "Success" });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDb();
        
        const user = await db.collection('users').findOne({ email });
        
        // Проверка пароля через bcrypt.compare
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            req.session.role = user.role;
            req.session.email = user.email;
            
            // Важно для сессий: сохраняем сессию принудительно перед ответом
            return req.session.save(() => {
                res.json({ message: "Welcome" });
            });
        }

        res.status(401).json({ error: "Invalid credentials" });
    } catch (e) {
        res.status(500).json({ error: "Server error during login" });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie('connect.sid'); 
        res.json({ ok: true });
    });
});

module.exports = router;