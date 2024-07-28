const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Database connection
let db = new sqlite3.Database('myDatabase.db', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected th the database.');
    }
});

// Credentials handling
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = `INSERT INTO credentials (username, password) VALUES (?, ?)`;

    db.run(sql, [username, password], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send({ success: false, error: 'Registration failed' });
        } else {
            res.send({ success: true });
        }
    });
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    console.log('Received sign-in request:', { username, password });

    const sql = `SELECT * FROM credentials WHERE username = ? AND password = ?`;

    db.all(sql, [username, password], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Sign-in failed due to a server error' });
        } else {
            if (rows.length > 0) {
                console.log('Sign-in successful for user:', username);

                // Insert a new task into the Tasks table
                const insertTaskSql = `INSERT INTO Tasks (task, taskDate) VALUES (?, ?)`;
                const task = `${username}, Hi, start using me!`;
                const taskDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

                db.run(insertTaskSql, [task, taskDate], (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting task:', insertErr.message);
                        res.status(500).send({ success: false, error: 'Failed to log sign-in event' });
                    } else {
                        console.log('Sign-in event logged as a task for user:', username);
                        res.send({ success: true });
                    }
                });
            } else {
                console.log('Invalid credentials for user:', username);
                res.send({ success: false });
            }
        }
    });
});

// Tasks handling
app.post('/add-task', (req, res) => {
    const { task, taskDate, userId } = req.body;

    const sql = `INSERT INTO Tasks (task, taskDate, userId) VALUES (?, ?, ?)`;
    db.run(sql, [task, taskDate, userId], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to add task' });
        } else {
            res.send({ success: true, taskID: this.lastID });
        }
    });
});

// Get all tasks
app.get('/get-tasks', (req, res) => {
    const sql = `SELECT * FROM Tasks`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to fetch tasks' });
        } else {
            res.send({ success: true, tasks: rows });
        }
    });
});

// Get tasks for a specific user
app.get('/get-user-tasks', (req, res) => {
    const { userId } = req.query;
    const sql = `SELECT * FROM Tasks WHERE userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to fetch tasks' });
        } else {
            res.send({ success: true, tasks: rows });
        }
    });
});

// Improved delete-task endpoint
app.post('/delete-task', (req, res) => {
    const { id } = req.body;
    console.log('Received request to delete task with ID:', id);

    if (!id) {
        console.error('ID is required for deletion');
        return res.status(400).send({ success: false, error: 'ID is required' });
    }

    const sql = `DELETE FROM Tasks WHERE id = ?`;

    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to delete task' });
        } else if (this.changes === 0) {
            console.warn('No task found with ID:', id);
            res.status(404).send({ success: false, error: 'Task not found' });
        } else {
            res.send({ success: true });
        }
    });
});

// Update a task
app.post('/update-task', (req, res) => {
    const { id, task, taskDate, priority, completed } = req.body;

    if (!id) {
        return res.status(400).send({ success: false, error: 'Task ID is required' });
    }

    const sql = `UPDATE Tasks SET task = ?, taskDate = ?, priority = ?, completed = ? WHERE id = ?`;

    db.run(sql, [task, taskDate, priority, completed, id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to update task' });
        } else {
            // Check if the row was actually updated
            if (this.changes === 0) {
                return res.status(404).send({ success: false, error: 'Task not found' });
            }
            res.send({ success: true });
        }
    });
});

// Search tasks
app.get('/search-tasks', (req, res) => {
    const searchTerm = req.query.term;

    if (!searchTerm) {
        return res.status(400).send({ success: false, error: 'Search term is required' });
    }

    console.log('Received search term:', searchTerm);

    const sql = `SELECT * FROM Tasks WHERE task LIKE ?`;
    const searchPattern = `%${searchTerm}%`;

    db.all(sql, [searchPattern], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to search tasks' });
        } else {
            console.log('Search results:', rows);
            res.send({ success: true, tasks: rows });
        }
    });
});

// Set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Initialize upload
const upload = multer({ storage: storage });

// Upload profile picture

app.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
    const { username } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send({ success: false, error: 'No file uploaded' });
    }

    const filePath = file.path;
    const sql = `UPDATE credentials SET profilePicture = ? WHERE username = ?`;

    db.run(sql, [filePath, username], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send({ success: false, error: 'Failed to upload profile picture' });
        } else if (this.changes === 0) {
            return res.status(404).send({ success: false, error: 'User not found' });
        } else {
            res.send({ success: true, message: 'Profile picture uploaded successfully', filePath: filePath });
        }
    });
});

// Update Password Endpoint
app.post('/updatePassword', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ success: false, error: 'Username and password are required' });
    }

    const sql = `UPDATE credentials SET password = ? WHERE username = ?`;
    db.run(sql, [password, username], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ success: false, error: 'Failed to update password' });
        } else {
            if (this.changes === 0) {
                return res.status(404).send({ success: false, error: 'User not found' });
            }
            res.send({ success: true });
        }
    });
});

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}




app.listen(3004, () => {
    console.log('Listening at port 3004');
});
