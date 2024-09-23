---

# To-Do List Application

## Overview
This To-Do List application allows users to efficiently manage their tasks with features like user authentication, task prioritization, and a responsive design. The app supports CRUD operations for tasks and uses SQLite for data storage, ensuring a smooth and user-friendly experience.

## Features

### User Authentication
- **Login Page**: Users can log in using their credentials.
- **Registration Page**: New users can create an account with:
  - A username
  - A secure password

### Home Page
- **To-Do List**: Displays all tasks associated with the logged-in user.

### Task Management
- **Search Function**: Users can search tasks by keywords.
- **Add New Task**: Users can add tasks by providing:
  - Task description
  - Priority level (High, Medium, Low)
- **Delete Task**: Users can remove tasks from their list.
- **Update Task**: Users can edit the details of an existing task.
- **Priority Color Coding**:
  - Red for High priority
  - Yellow for Medium priority
  - Green for Low priority

## Technology Stack

- **Frontend**: React for building the user interface, with CSS for styling.
- **Database**: SQLite is used for persistent storage of tasks and user data.

## Setup Instructions

### Prerequisites
Before setting up the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (for running the application)
- [SQLite](https://www.sqlite.org/download.html) (for database management)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Xoli-Nxiweni/ToDoList_System
   cd todo-app
   ```

2. **Switch to the Correct Branch**:
   Checkout the `SQL.js` branch for the SQLite functionality:
   ```bash
   git checkout SQL.js
   ```

3. **Navigate to the Frontend Folder**:
   Move to the folder where the frontend code is located:
   ```bash
   cd Frontend/ToDoList
   ```

4. **Install Dependencies**:
   Install the required packages:
   ```bash
   npm install
   npm install SQL.js
   ```

   The key dependencies include:
   - `@emotion/react`
   - `@emotion/styled`
   - `@mui/icons-material`
   - `axios`
   - `react`
   - `react-dom`
   - `react-icons`
   - `sql.js`

5. **Run the Application**:
   Start the development server using Vite:
   ```bash
   npm run dev
   ```

   You can then access the application at `http://localhost:5173`.

## Usage

1. **Register**: Create an account by providing a username and password on the Registration page.
2. **Log In**: Log in to your account using your credentials on the Login page.
3. **Manage To-Do Items**:
   - *Add*: Add new tasks with a description and priority level.
   - *Search*: Filter tasks using the search bar.
   - *Update*: Modify the details of any existing task.
   - *Delete*: Remove tasks from the list.

## Input Validation
- Input fields are validated to prevent errors:
  - Passwords are validated for strength.
  - Invalid characters or empty values are not allowed in the input fields.

## Authentication & Authorization
- User data is securely protected through authentication.
- Each user can only access and manage their own to-do lists.

## Contact
For any questions or feedback, please reach out via email:
- **Email**: [xolinxiweni@gmail.com](mailto:xolinxiweni@gmail.com) | [xolinxiweni@outlook.com](mailto:xolinxiweni@outlook.com)

---

### Important Note:
To work with SQLite functionality, ensure you switch to the **SQL.js** branch or navigate to the correct folder:  
[`Frontend/ToDoList`](https://github.com/Xoli-Nxiweni/ToDoList_System/tree/SQL.js/Frontend/ToDoList).

--- 
