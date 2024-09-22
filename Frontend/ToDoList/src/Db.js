// src/Db.js
import initSqlJs from 'sql.js';
let db;

// Initialize the database
export const initializeDb = async () => {
  try {
    const SQL = await initSqlJs({
      locateFile: () => `/sql-wasm.wasm`
    });

    const savedDb = localStorage.getItem('sqlite-db');
    if (savedDb) {
      db = new SQL.Database(new Uint8Array(JSON.parse(savedDb)));
      await addMissingColumns();
    } else {
      db = new SQL.Database();
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY, 
        username TEXT UNIQUE, 
        password TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY, 
        name TEXT, 
        completed INTEGER DEFAULT 0, 
        priority TEXT DEFAULT 'low', 
        taskDate TEXT
      )`);
    }
  } catch (error) {
    // Handle initialization error silently or log as needed
  }
};

// Add missing columns if they do not already exist
const addMissingColumns = async () => {
  try {
    const columns = db.exec("PRAGMA table_info(tasks)");
    const columnNames = columns.length > 0 && columns[0].values ? 
      columns[0].values.map(([name]) => name) : [];

    if (!columnNames.includes('taskDate')) {
      db.run('ALTER TABLE tasks ADD COLUMN taskDate TEXT');
    }
    if (!columnNames.includes('priority')) {
      db.run('ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT "low"');
    }
  } catch (error) {
    if (!error.message.includes('duplicate column name')) {
      // Handle error silently or log as needed
    }
  }
};

// Save the database to local storage
const saveDb = () => {
  try {
    const data = db.export();
    localStorage.setItem('sqlite-db', JSON.stringify(Array.from(data)));
  } catch (error) {
    // Handle save error silently or log as needed
  }
};

// Add a new user
export const addUser = (username, password) => {
  try {
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);
    saveDb();
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed: users.username')) {
      throw new Error('Username already exists. Please choose a different username.');
    }
  }
};

// Get user details
export const getUser = (username) => {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind([username]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();
    return result[0] || null;
  } catch (error) {
    // Handle retrieval error silently or log as needed
  }
};

// Authenticate user credentials
export const authenticateUser = (username, password) => {
  const user = getUser(username);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Add a new task
export const addTask = (name, taskDate = '', priority = 'low') => {
  try {
    db.run('INSERT INTO tasks (name, completed, taskDate, priority) VALUES (?, ?, ?, ?)', 
      [name, 0, taskDate, priority]); // 0 for false
    saveDb();
  } catch (error) {
    // Handle add task error silently or log as needed
  }
};

// Update an existing task
export const updateTask = (id, updatedTask) => {
  if (!updatedTask || typeof updatedTask !== 'object') {
    return;
  }

  let stmt;

  try {
    stmt = db.prepare('UPDATE tasks SET name = ?, completed = ?, taskDate = ?, priority = ? WHERE id = ?');
    stmt.run([
      updatedTask.name || '',
      updatedTask.completed ? 1 : 0, // Store 1 for true
      updatedTask.taskDate || '',
      updatedTask.priority || '',
      id
    ]);
    saveDb();
  } catch (error) {
    // Handle update error silently or log as needed
  } finally {
    if (stmt) stmt.free();
  }
};

// Get all tasks
export const getTasks = () => {
  try {
    const result = db.exec('SELECT * FROM tasks');
    return result[0]?.values.map(task => ({
      id: task[0],
      name: task[1],
      completed: Boolean(task[2]),
      priority: task[3],
      taskDate: task[4]
    })) || [];
  } catch (error) {
    // Handle retrieval error silently or log as needed
  }
};

// Delete a task
export const deleteTask = (id) => {
  try {
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    saveDb();
  } catch (error) {
    // Handle delete error silently or log as needed
  }
};
