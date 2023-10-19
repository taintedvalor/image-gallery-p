const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

const db = new sqlite3.Database('database.db');

app.use(express.static('public'));
app.use(express.json());

// SQLite database schema
db.run(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT
  )
`);

// Multer configuration
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Express route for image upload
app.post('/upload', upload.single('image'), (req, res) => {
  const { filename } = req.file;

  // Insert the filename into the database
  db.run('INSERT INTO images (filename) VALUES (?)', [filename], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(201).send('Image uploaded successfully');
  });
});

// Express route for getting all images
app.get('/images', (req, res) => {
  db.all('SELECT * FROM images', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
