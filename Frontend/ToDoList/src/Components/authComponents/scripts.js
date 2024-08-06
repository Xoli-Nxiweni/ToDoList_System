// // Function to handle user sign-in
// export const signin = (db, username, password) => {
//     try {
//         const result = db.exec("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
//         if (result[0]?.values.length) {
//             return { success: true };
//         } else {
//             return { success: false, error: 'Invalid username or password' };
//         }
//     } catch (error) {
//         console.error('Error signing in:', error);
//         return { success: false, error: `An error occurred: ${error.message}` };
//     }
// };

// // Function to handle user registration
// export const register = (db, username, password) => {
//     try {
//         const existingUser = db.exec("SELECT * FROM users WHERE username = ?", [username]);
//         if (existingUser[0]?.values.length) {
//             return { success: false, error: 'Username already exists' };
//         }

//         const hashedPassword = password; // You might want to hash the password here
//         db.run("INSERT INTO users (username, password, tasks) VALUES (?, ?, ?)", [username, hashedPassword, "[]"]);
//         return { success: true };
//     } catch (error) {
//         console.error('Error registering user:', error);
//         return { success: false, error: `An error occurred: ${error.message}` };
//     }
// };

// // Function to handle adding tasks (you can customize this based on your needs)
// export const addingTasks = (db, username, task) => {
//     try {
//         // Example query to add a task (assuming tasks are stored as JSON strings)
//         const result = db.exec("SELECT tasks FROM users WHERE username = ?", [username]);
//         if (result[0]?.values.length) {
//             let tasks = JSON.parse(result[0].values[0][0]);
//             tasks.push(task);
//             db.run("UPDATE users SET tasks = ? WHERE username = ?", [JSON.stringify(tasks), username]);
//             return { success: true };
//         } else {
//             return { success: false, error: 'User not found' };
//         }
//     } catch (error) {
//         console.error('Error adding task:', error);
//         return { success: false, error: `An error occurred: ${error.message}` };
//     }
// };
