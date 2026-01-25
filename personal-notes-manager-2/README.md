# Personal Notes Manager - Assignment 3 Part 1

## Project Overview
A full-stack web application for managing personal notes with a RESTful API backend powered by MongoDB and Express.js. This project demonstrates complete CRUD operations, advanced querying capabilities, and proper API design principles.

## Features
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ MongoDB integration with native Node.js driver
- ✅ Advanced filtering, sorting, and projection
- ✅ Category-based organization
- ✅ Search functionality
- ✅ Input validation and error handling
- ✅ Proper HTTP status codes
- ✅ Custom logger middleware
- ✅ Clean project structure

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (native driver)
- **Frontend**: HTML, CSS, JavaScript


## Team Members
- Kausar Tukezhan
- Behruz Tokkhtamishov
- Ginayat Yerassyl

## Project Structure
```
personal-notes-manager-2/
├── server.js              # Main application file
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── database/
│   └── db.js             # MongoDB connection module
├── routes/
│   └── notes.js          # Notes API routes
├── views/
│   ├── index.html        # Home page with API test links
│   ├── about.html        # About page
│   ├── contact.html      # Contact page
│   ├── search.html       # Search page
│   └── 404.html          # 404 error page
├── public/
│   └── style.css         # Stylesheet
└── data/
    └── contacts.json     # Contact form submissions
```

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) installed and running locally

## Installation

### 1. Install MongoDB
If MongoDB is not installed:

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### 2. Clone and Setup Project
```bash
# Navigate to project directory
cd /Applications/development/personal-notes-manager-2

# Install dependencies
npm install

# Start the server
node server.js
```

The server will start on `http://localhost:3000`

## Database

The project uses **MongoDB** (native Node.js driver)

### Collection: `notes`

| Field      | Type     | Description                           |
|------------|----------|---------------------------------------|
| _id        | ObjectId | Primary Key (auto-generated)          |
| title      | String   | Note title (required)                 |
| content    | String   | Note content (required)               |
| category   | String   | Note category (default: "general")    |
| createdAt  | Date     | Creation timestamp                    |
| updatedAt  | Date     | Last update timestamp                 |

Database information:
- **Database Name**: `notesManager`
- **Collection Name**: `notes`
- **Connection**: `mongodb://localhost:27017`

The collection is created automatically on first insert.

---

## API (CRUD)

| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| GET    | /api/notes     | Get all notes (with filtering) |
| GET    | /api/notes/:id | Get a note by ID               |
| POST   | /api/notes     | Create a new note              |
| PUT    | /api/notes/:id | Update a note                  |
| DELETE | /api/notes/:id | Delete a note                  |

### GET /api/notes - Query Parameters

**Filtering:**
- `category=work` - Filter by category
- `search=test` - Search in title and content
- `filter={"category":"work"}` - Advanced JSON filter

**Sorting:**
- `sort={"createdAt":-1}` - Sort by date (newest first)
- `sort={"title":1}` - Sort by title (A-Z)

**Projection:**
- `fields=title,category` - Return only specific fields

### Example POST body

```json
{
  "title": "My first note",
  "content": "This is my note content",
  "category": "work"
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, or DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid ID or missing required fields
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server or database error

## 🌐 Routes

| Route           | Description             |
| --------------- | ----------------------- |
| /               | Home page               |
| /search?q=value | Search example          |
| /item/:id       | Route parameter example |
| /contact        | Contact form            |
| /api/info       | Project info in JSON    |

### POST Routes
- `/contact` - Handles form submissions from the contact page
  - Accepts: name, email, message

## Behavior:

 - Server validates input

 - Data is saved into a JSON file (data/contacts.json)

 - User receives a confirmation message
## Middleware:
 The project uses:
 - express.urlencoded({ extended: true })
 - Custom logger middleware (logs HTTP method and URL)

### Error Handling
- Custom 404 page for unknown routes using app.use()

## Contact Form Details
The contact form includes the following fields:
- **Name** (required) - Text input for user's name
- **Email** (required) - Email input with validation
- **Message** (required) - Textarea for user's message
- **Submit button** - Sends data via POST to `/contact`

When submitted, the form:
1. Sends data to the server using POST method
2. Server logs the data to the console
3. User receives a confirmation message with their name


## Project Structure

```
personal-notes-manager/
│
├── server.js
├── package.json
├── README.md
│
├── data/
│   ├── contacts.json
│   └── notes.db
│
├── public/
│   └── style.css
│
└── views/
   ├── index.html
   ├── contact.html
   ├── about.html
   ├── item.html
   ├── search.html
   └── 404.html
```

## Technologies

* Node.js
* Express.js
* SQLite
* HTML5
* CSS3

## Planned Features
- Categorize notes
- Tagging system
- Full-text search

## Roadmap
* Week 1: Express setup & landing page ✅
* Week 2: Forms and POST routes ✅
* Week 3: Database integration (SQLite) ✅
* Week 4: CRUD operations for Notes API ✅
* Week 5: Final validation & improvements 

