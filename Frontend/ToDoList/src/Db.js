// import initSqlJs from 'sql.js';
// let db;

// export const initializeDb = async () => {
//   try {
//     const SQL = await initSqlJs({
//       locateFile: () => `/sql-wasm.wasm`
//     });

//     const savedDb = localStorage.getItem('sqlite-db');
//     if (savedDb) {
//       db = new SQL.Database(new Uint8Array(JSON.parse(savedDb)));

//       // Check existing columns
//       const columns = db.exec("PRAGMA table_info(tasks)");
//       console.log('Columns:', columns); // For debugging

//       if (columns.length > 0 && columns[0].values) {
//         const columnNames = columns[0].values.map(([name]) => name);

//         // Add missing columns if they do not already exist
//         if (!columnNames.includes('taskDate')) {
//           db.run('ALTER TABLE tasks ADD COLUMN taskDate TEXT');
//         }
//         if (!columnNames.includes('priority')) {
//           db.run('ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT "low"');
//         }
//       }
//     } else {
//       db = new SQL.Database();
//       db.run(`CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY, 
//         username TEXT UNIQUE, 
//         password TEXT
//       )`);
//       db.run(`CREATE TABLE IF NOT EXISTS tasks (
//         id INTEGER PRIMARY KEY, 
//         name TEXT, 
//         completed BOOLEAN, 
//         priority TEXT DEFAULT 'low',
//         taskDate TEXT
//       )`);
      
//       // Optional: Insert a sample task if no tasks exist
//       const result = db.exec('SELECT COUNT(*) FROM tasks');
//       if (result.length > 0 && result[0].values.length > 0) {
//         if (result[0].values[0][0] === 0) {
//           db.run('INSERT INTO tasks (name, completed, priority, taskDate) VALUES (?, ?, ?, ?)', 
//             ['Sample Task', false, 'low', new Date().toISOString().split('T')[0]]);
//         }
//       }
//     }
//     console.log('Database initialized');
//   } catch (error) {
//     console.error('Database initialization failed', error);
//   }
// };


// export const addUser = (username, password) => {
//   try {
//     db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);
//     saveDb();
//   } catch (error) {
//     if (error.message.includes('UNIQUE constraint failed: users.username')) {
//       throw new Error('Username already exists. Please choose a different username.');
//     } else {
//       console.error(`Error adding user: ${error}`);
//     }
//   }
// };

// export const getUser = (username) => {
//   try {
//     const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
//     console.log(stmt);
    
//     stmt.bind([username]);
//     const result = [];
//     while (stmt.step()) {
//       result.push(stmt.getAsObject());
//     }
//     stmt.free();
//     return result[0] || null;
//   } catch (error) {
//     console.error(`Error retrieving user: ${error}`);
//   }
// };

// export const authenticateUser = (username, password) => {
//   const user = getUser(username);
//   if (user && user.password === password) {
//     return user;
//   }
//   return null;
// };

// const saveDb = () => {
//   const data = db.export();
//   localStorage.setItem('sqlite-db', JSON.stringify(Array.from(data)));
// };

// export const getTasks = () => {
//   const result = db.exec('SELECT * FROM tasks');
//   return result[0]?.values || [];
// };

// export const addTask = (name, taskDate, priority) => {
//   if (typeof name !== 'string' || typeof taskDate !== 'string' || typeof priority !== 'string') {
//     console.error('Invalid data types provided to addTask');
//     return;
//   }

//   db.run('INSERT INTO tasks (name, completed, taskDate, priority) VALUES (?, ?, ?, ?)', 
//     [name, false, taskDate, priority]);
//   saveDb();
// };


// export const updateTask = (id, updatedTask) => {
//   if (!updatedTask || typeof updatedTask !== 'object') {
//     console.error('Update task failed: updatedTask is invalid or undefined');
//     return;
//   }

//   console.log('Updating task:', { id, updatedTask });

//   try {
//     db.run('UPDATE tasks SET name = ?, completed = ?, taskDate = ?, priority = ? WHERE id = ?', 
//       [updatedTask.name, updatedTask.completed, updatedTask.taskDate, updatedTask.priority, id]);
//     saveDb();
//   } catch (error) {
//     console.error(`Error updating task: ${error}`);
//   }
// };

// export const deleteTask = (id) => {
//   db.run('DELETE FROM tasks WHERE id = ?', [id]);
//   saveDb();
// };


// src/Db.js
// import initSqlJs from 'sql.js';
// let db;

// // Initialize the database
// export const initializeDb = async () => {
//   try {
//     const SQL = await initSqlJs({
//       locateFile: () => `/sql-wasm.wasm`
//     });

//     const savedDb = localStorage.getItem('sqlite-db');
//     if (savedDb) {
//       db = new SQL.Database(new Uint8Array(JSON.parse(savedDb)));

//       // Check and add missing columns
//       await addMissingColumns();
//     } else {
//       db = new SQL.Database();
//       db.run(`CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY, 
//         username TEXT UNIQUE, 
//         password TEXT
//       )`);
//       db.run(`CREATE TABLE IF NOT EXISTS tasks (
//         id INTEGER PRIMARY KEY, 
//         name TEXT, 
//         completed BOOLEAN, 
//         priority TEXT DEFAULT 'low',
//         taskDate TEXT
//       )`);

//       // Optional: Insert a sample task if no tasks exist
//       const result = db.exec('SELECT COUNT(*) FROM tasks');
//       if (result.length > 0 && result[0].values.length > 0) {
//         if (result[0].values[0][0] === 0) {
//           db.run('INSERT INTO tasks (name, completed, priority, taskDate) VALUES (?, ?, ?, ?)', 
//             ['Sample Task', false, 'low', new Date().toISOString().split('T')[0]]);
//         }
//       }
//     }
//     console.log('Database initialized');
//   } catch (error) {
//     console.error('Database initialization failed', error.message);
//   }
// };

// // Add missing columns if they do not already exist
// const addMissingColumns = () => {
//   try {
//     const columns = db.exec("PRAGMA table_info(tasks)");
//     const columnNames = columns.length > 0 && columns[0].values ? 
//       columns[0].values.map(([name]) => name) : [];

//     if (!columnNames.includes('taskDate')) {
//       db.run('ALTER TABLE tasks ADD COLUMN taskDate TEXT');
//     }
//     if (!columnNames.includes('priority')) {
//       db.run('ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT "low"');
//     }
//   } catch (error) {
//     console.error('Error checking or adding columns:', error.message);
//   }
// };

// // Save the database to local storage
// const saveDb = () => {
//   const data = db.export();
//   localStorage.setItem('sqlite-db', JSON.stringify(Array.from(data)));
// };

// // Add a new user
// export const addUser = (username, password) => {
//   try {
//     db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);
//     saveDb();
//   } catch (error) {
//     if (error.message.includes('UNIQUE constraint failed: users.username')) {
//       throw new Error('Username already exists. Please choose a different username.');
//     } else {
//       console.error(`Error adding user: ${error.message}`);
//     }
//   }
// };

// // Get user details
// export const getUser = (username) => {
//   try {
//     const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
//     stmt.bind([username]);
//     const result = [];
//     while (stmt.step()) {
//       result.push(stmt.getAsObject());
//     }
//     stmt.free();
//     return result[0] || null;
//   } catch (error) {
//     console.error(`Error retrieving user: ${error.message}`);
//   }
// };

// // Authenticate user credentials
// export const authenticateUser = (username, password) => {
//   const user = getUser(username);
//   if (user && user.password === password) {
//     return user;
//   }
//   return null;
// };

// // Get all tasks
// export const getTasks = () => {
//   try {
//     const result = db.exec('SELECT * FROM tasks');
//     return result[0]?.values || [];
//   } catch (error) {
//     console.error('Error retrieving tasks:', error.message);
//   }
// };

// // Add a new task
// export const addTask = (name, taskDate = '', priority = 'low') => {
//   if (typeof name !== 'string' || typeof taskDate !== 'string' || typeof priority !== 'string') {
//     console.error('Invalid data types provided to addTask');
//     return;
//   }

//   try {
//     db.run('INSERT INTO tasks (name, completed, taskDate, priority) VALUES (?, ?, ?, ?)', 
//       [name, false, taskDate, priority]);
//     saveDb();
//   } catch (error) {
//     console.error('Error adding task:', error.message);
//   }
// };

// // Update an existing task
// export const updateTask = (id, updatedTask) => {
//   if (!updatedTask || typeof updatedTask !== 'object') {
//     console.error('Update task failed: updatedTask is invalid or undefined');
//     return;
//   }

//   try {
//     db.run('UPDATE tasks SET name = ?, completed = ?, taskDate = ?, priority = ? WHERE id = ?', 
//       [updatedTask.name, updatedTask.completed, updatedTask.taskDate, updatedTask.priority, id]);
//     saveDb();
//   } catch (error) {
//     console.error(`Error updating task: ${error.message}`);
//   }
// };

// // Delete a task
// export const deleteTask = (id) => {
//   try {
//     db.run('DELETE FROM tasks WHERE id = ?', [id]);
//     saveDb();
//   } catch (error) {
//     console.error('Error deleting task:', error.message);
//   }
// };


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

      // Check and add missing columns
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
        completed BOOLEAN, 
        priority TEXT DEFAULT 'low',
        taskDate TEXT
      )`);

      // Optional: Insert a sample task if no tasks exist
      const result = db.exec('SELECT COUNT(*) FROM tasks');
      if (result.length > 0 && result[0].values.length > 0) {
        if (result[0].values[0][0] === 0) {
          db.run('INSERT INTO tasks (name, completed, priority, taskDate) VALUES (?, ?, ?, ?)', 
            ['Sample Task', false, 'low', new Date().toISOString().split('T')[0]]);
        }
      }
    }
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed', error.message);
  }
};

// Add missing columns if they do not already exist
const addMissingColumns = () => {
  try {
    const columns = db.exec("PRAGMA table_info(tasks)");
    const columnNames = columns.length > 0 && columns[0].values ? 
      columns[0].values.map(([name]) => name) : [];

    // Check and add missing columns
    if (!columnNames.includes('taskDate')) {
      db.run('ALTER TABLE tasks ADD COLUMN taskDate TEXT');
    }
    if (!columnNames.includes('priority')) {
      db.run('ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT "low"');
    }
  } catch (error) {
    // Handle error but do not fail silently
    if (!error.message.includes('duplicate column name')) {
      console.error('Error checking or adding columns:', error.message);
    }
  }
};

// Save the database to local storage
const saveDb = () => {
  const data = db.export();
  localStorage.setItem('sqlite-db', JSON.stringify(Array.from(data)));
};

// Add a new user
export const addUser = (username, password) => {
  try {
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);
    saveDb();
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed: users.username')) {
      throw new Error('Username already exists. Please choose a different username.');
    } else {
      console.error(`Error adding user: ${error.message}`);
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
    console.error(`Error retrieving user: ${error.message}`);
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

// Get all tasks
// export const getTasks = () => {
//   try {
//     const result = db.exec('SELECT * FROM tasks');
//     return result[0]?.values || [];
//   } catch (error) {
//     console.error('Error retrieving tasks:', error.message);
//   }
// };

// Add a new task
export const addTask = (name, taskDate = '', priority = 'low') => {
  if (typeof name !== 'string' || typeof taskDate !== 'string' || typeof priority !== 'string') {
    console.error('Invalid data types provided to addTask');
    return;
  }

  try {
    db.run('INSERT INTO tasks (name, completed, taskDate, priority) VALUES (?, ?, ?, ?)', 
      [name, false, taskDate, priority]);
    saveDb();
  } catch (error) {
    console.error('Error adding task:', error.message);
  }
};

// Update an existing task
// src/Db.js

// Update an existing task
// export const updateTask = (id, updatedTask) => {
//   if (!updatedTask || typeof updatedTask !== 'object') {
//     console.error('Update task failed: updatedTask is invalid or undefined');
//     return;
//   }

//   console.log('Updating task:', { id, updatedTask });

//   try {
//     db.run('UPDATE tasks SET name = ?, completed = ?, taskDate = ?, priority = ? WHERE id = ?', 
//       [updatedTask.name, updatedTask.completed, updatedTask.taskDate, updatedTask.priority, id]);
//     saveDb();
    
//     // Verify the update
//     const updated = db.exec('SELECT * FROM tasks WHERE id = ?', [id]);
//     console.log('Updated task:', updated);
    
//   } catch (error) {
//     console.error(`Error updating task: ${error.message}`);
//   }
// };

export const updateTask = (id, updatedTask) => {
  if (!updatedTask || typeof updatedTask !== 'object') {
    console.error('Update task failed: updatedTask is invalid or undefined');
    return;
  }

  console.log('Updating task:', { id, updatedTask });

  try {
    db.run('UPDATE tasks SET name = ?, completed = ?, taskDate = ?, priority = ? WHERE id = ?', 
      [updatedTask.name, updatedTask.completed ? 1 : 0, updatedTask.taskDate, updatedTask.priority, id]);
    saveDb();
    
    // Verify the update
    const updated = db.exec('SELECT * FROM tasks WHERE id = ?', [id]);
    if (updated.length > 0 && updated[0].values.length > 0) {
      console.log('Updated task:', updated[0].values[0]);
    } else {
      console.error('Task update verification failed: No task found with the given ID');
    }
    
  } catch (error) {
    console.error(`Error updating task: ${error.message}`);
  }
};




// Function to get all tasks for debugging
export const getTasks = () => {
  try {
    const result = db.exec('SELECT * FROM tasks');
    console.log('Tasks retrieved:', result);
    return result[0]?.values || [];
  } catch (error) {
    console.error('Error retrieving tasks:', error.message);
  }
};


// Delete a task
export const deleteTask = (id) => {
  try {
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    saveDb();
  } catch (error) {
    console.error('Error deleting task:', error.message);
  }
};
