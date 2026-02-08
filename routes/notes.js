const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');
const { ObjectId } = require('mongodb');

const isAuth = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: "Unauthorized" });
};

router.get('/', isAuth, async (req, res) => {
    const db = getDb();
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const limit = 6;

    const query = req.session.role === 'admin' 
        ? { title: { $regex: search, $options: 'i' } }
        : { userId: new ObjectId(req.session.userId), title: { $regex: search, $options: 'i' } };

    const total = await db.collection('notes').countDocuments(query);
    const notes = await db.collection('notes').find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit).toArray();

    res.json({ notes, totalPages: Math.ceil(total / limit) });
});

router.post('/', isAuth, async (req, res) => {
    const { title, content, priority, category } = req.body;
    const db = getDb();
    
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ error: "Title must be at least 3 characters long" });
    }
    if (!content || content.trim().length < 1) {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    const newNote = {
        title: title.trim(),
        content: content.trim(),
        priority: priority || "Normal",
        category: category || "General",
        userId: new ObjectId(req.session.userId),
        author: req.session.email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await db.collection('notes').insertOne(newNote);
    res.status(201).json(newNote);
});

router.delete('/:id', isAuth, async (req, res) => {
    const db = getDb();
    const query = { _id: new ObjectId(req.params.id) };
    if (req.session.role !== 'admin') query.userId = new ObjectId(req.session.userId);
    await db.collection('notes').deleteOne(query);
    res.json({ success: true });
});

router.get('/me', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "No session" });
    res.json({ email: req.session.email, role: req.session.role });
});

router.put('/:id', isAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const db = getDb();
        
        const query = { _id: new ObjectId(req.params.id) };
        if (req.session.role !== 'admin') {
            query.userId = new ObjectId(req.session.userId);
        }

        const result = await db.collection('notes').updateOne(
            query,
            { 
                $set: { 
                    title: title.trim(), 
                    content: content.trim(), 
                    updatedAt: new Date() 
                } 
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }

        res.json({ message: "Success" });
    } catch (e) {
        res.status(500).json({ error: "Update failed" });
    }
});
const fs = require('fs');
const path = require('path');

// Роут для просмотра всех сообщений из файла (только для админа)
router.get('/admin/contacts', isAuth, async (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const filePath = path.join(__dirname, '../data/contacts.json');
    
    try {
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            const messages = JSON.parse(fileData || "[]");
            res.json(messages);
        } else {
            res.json({ message: "No contact messages found in file." });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to read messages" });
    }
});
module.exports = router;