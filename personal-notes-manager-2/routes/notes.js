const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../database/db');

const router = express.Router();

/**
 * Helper function to validate MongoDB ObjectId
 */
function isValidObjectId(id) {
    return ObjectId.isValid(id) && (String(new ObjectId(id)) === id);
}

/**
 * GET /api/notes
 * Return all notes with support for filtering, sorting, and projection
 * 
 * Query parameters:
 * - filter: JSON string for filtering (e.g., {"category": "work"})
 * - sort: JSON string for sorting (e.g., {"createdAt": -1})
 * - fields: Comma-separated list of fields to include (e.g., "title,category")
 * - category: Filter by category
 * - search: Search in title and content
 */
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection('notes');

        // Build filter object
        let filter = {};

        // Parse filter from query parameter
        if (req.query.filter) {
            try {
                filter = JSON.parse(req.query.filter);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid filter format. Must be valid JSON.' });
            }
        }

        // Add category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Add search functionality
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sort = { createdAt: -1 }; // Default: newest first
        if (req.query.sort) {
            try {
                sort = JSON.parse(req.query.sort);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid sort format. Must be valid JSON.' });
            }
        }

        // Build projection object
        let projection = {};
        if (req.query.fields) {
            const fields = req.query.fields.split(',');
            fields.forEach(field => {
                projection[field.trim()] = 1;
            });
        }

        // Execute query
        const notes = await collection
            .find(filter, { projection })
            .sort(sort)
            .toArray();

        res.status(200).json({
            count: notes.length,
            notes: notes
        });

    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

       
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid id format' });
        }

        const db = getDB();
        const collection = db.collection('notes');

        const note = await collection.findOne({ _id: new ObjectId(id) });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(note);

    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, content, category } = req.body;

        
        if (!title || !content) {
            return res.status(400).json({ error: 'Missing required fields: title and content' });
        }

        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title must be a non-empty string' });
        }

        if (typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content must be a non-empty string' });
        }

        const db = getDB();
        const collection = db.collection('notes');

       
        const newNote = {
            title: title.trim(),
            content: content.trim(),
            category: category ? category.trim() : 'general',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        
        const result = await collection.insertOne(newNote);

        res.status(201).json({
            _id: result.insertedId,
            ...newNote
        });

    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid id format' });
        }

       
        if (!title || !content) {
            return res.status(400).json({ error: 'Missing required fields: title and content' });
        }

        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title must be a non-empty string' });
        }

        if (typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content must be a non-empty string' });
        }

        const db = getDB();
        const collection = db.collection('notes');

     
        const updateDoc = {
            $set: {
                title: title.trim(),
                content: content.trim(),
                category: category ? category.trim() : 'general',
                updatedAt: new Date()
            }
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            updateDoc,
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

     
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid id format' });
        }

        const db = getDB();
        const collection = db.collection('notes');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });

    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
