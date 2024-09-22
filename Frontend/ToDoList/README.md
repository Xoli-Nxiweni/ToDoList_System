## To-Do List Application

## Overview
This To-Do List application allows users to manage their tasks efficiently. It includes user authentication, task management features, and a responsive design to ensure a user-friendly experience. The application supports CRUD operations for to-do items and uses SQLite for data storage.

## Features

### Authentication
- **Login Page**: Users can log in with their credentials.
- **Registration Page**: New users can register with:
  - Username
  - Password

### Home Page
- **To-Do List**: Displays the user's to-do list items.

### To-Do List Features
- **Search Function**: Users can search for items by keyword.
- **Add Function**: Users can add a new item with:
  - Task Description
  - Priority (High, Medium, Low)
- **Delete Function**: Users can delete existing items.
- **Update Function**: Users can edit existing items.
- **Priority Colors**: Items are color-coded based on priority:
  - Red for High
  - Yellow for Medium
  - Green for Low

## Technology Stack
- **Frontend**: React for UI components, CSS for styling.
- **Database**: SQLite for storing user information and to-do list items.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (for running the application)
- [SQLite](https://www.sqlite.org/download.html) (for database management)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Xoli-Nxiweni/ToDoList_System
   cd todo-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install the following dependencies:
   - `@emotion/react`: ^11.13.0
   - `@emotion/styled`: ^11.13.0
   - `@mui/icons-material`: ^5.16.5
   - `axios`: ^1.7.2
   - `react`: ^18.3.1
   - `react-dom`: ^18.3.1
   - `react-icons`: ^5.2.1
   - `sql.js`: ^1.11.0

3. **Run the application**:
   - To run the frontend using Vite:
     ```bash
     npm run dev
     ```

   The application will be available at `http://localhost:5173`.

## Usage

1. **Register a new user**:
   - Go to the Registration page and provide a username and password.

2. **Log in**:
   - Use your credentials to log in on the Login page.

3. **Manage To-Do Items**:
   - *Add a Task*: Enter a task description and select a priority level to add a new item.
   - *Search Tasks*: Use the search bar to filter tasks by keyword.
   - *Update a Task*: Edit task details including the description and priority.
   - *Delete a Task*: Remove items from the list.

## Validation
- Ensure proper validation for input fields to prevent errors:
  - Passwords must be validated on the backend for strength.
  - Input fields should not accept invalid characters or empty values.

## Authentication and Authorization
- User data is protected through authentication.
- Users can only access their own to-do lists.

## Contact
For any questions or feedback, you can reach me at:
- **Email**: xolinxiweni@gmail.com || xolinxiweni@outlook.com

---
