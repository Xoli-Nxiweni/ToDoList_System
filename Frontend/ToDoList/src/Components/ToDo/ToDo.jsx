import { useState, useEffect } from 'react';
import './ToDo.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// eslint-disable-next-line react/prop-types
const ToDo = ({ simulateLoading, searchTerm }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newPriority, setNewPriority] = useState(null);
    const [editIndex, setEditIndex] = useState(-1);

    // Function to get userId from localStorage
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.id : null;
    };

    const fetchTasks = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const response = await fetch(`http://localhost:3004/users/${userId}`);
            const result = await response.json();
            if (response.ok) {
                setTasks(result.tasks || []);
            } else {
                console.error('Failed to fetch tasks:', result.error);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (newTask.trim() === '') return;
        simulateLoading(true);

        const task = { task: newTask, taskDate: newDate, priority: newPriority, completed: false };
        const userId = getUserId();

        if (editIndex >= 0) {
            // Update existing task
            const updatedTask = { ...task, id: tasks[editIndex].id };
            try {
                const response = await fetch(`http://localhost:3004/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tasks: tasks.map((t, index) =>
                        index === editIndex ? updatedTask : t
                    ) })
                });
                const result = await response.json();
                if (response.ok) {
                    setTasks(tasks.map((t, index) =>
                        index === editIndex ? updatedTask : t
                    ));
                    setEditIndex(-1);
                } else {
                    console.error('Failed to update task:', result.error);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            // Add new task
            try {
                const response = await fetch(`http://localhost:3004/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tasks: [...tasks, { ...task, id: Date.now() }] })
                });
                const result = await response.json();
                if (response.ok) {
                    setTasks([...tasks, { ...task, id: Date.now() }]);
                } else {
                    console.error('Failed to add task:', result.error);
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }

        setNewTask('');
        setNewDate('');
        setNewPriority('low');
        simulateLoading(false);
    };

    const changeTaskPriority = async (index, priority) => {
        const taskId = tasks[index].id;
        const userId = getUserId();

        // Update the local state first
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, priority } : task
        );
        setTasks(updatedTasks);

        try {
            // Update the task on the server
            const response = await fetch(`http://localhost:3004/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks: updatedTasks
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update task priority on server: ${errorText}`);
            }

            const result = await response.json();
            console.log('Task priority updated:', result);
        } catch (error) {
            console.error('Error updating task priority:', error);
        }
    };

    // const toggleCompleteTask = (index) => {
    //     const updatedTasks = tasks.map((task, i) =>
    //         i === index ? { ...task, completed: !task.completed } : task
    //     );
    //     setTasks(updatedTasks);
    // };

    const toggleCompleteTask = async (index) => {
        // Step 1: Update the local state first
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
    
        // Step 2: Get the task ID and user ID
        const taskId = tasks[index].id;
        const userId = getUserId(); // Assume getUserId() is a function that retrieves the current user ID
    
        // Step 3: Update the task on the server
        try {
            const response = await fetch(`http://localhost:3004/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks: updatedTasks // Send the updated tasks array to the server
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update task completion status on server');
            }
    
            const result = await response.json();
            console.log('Task completion status updated:', result);
        } catch (error) {
            console.error('Error updating task completion status:', error);
        }
    };
    

    const editTask = (index) => {
        const task = tasks[index];
        setEditIndex(index);
        setNewTask(task.task);
        setNewDate(task.taskDate);
        setNewPriority(task.priority);
    };

    const deleteTask = async (index) => {
        const taskId = tasks[index].id;
        const userId = getUserId();

        try {
            const response = await fetch(`http://localhost:3004/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: tasks.filter((_, i) => i !== index) })
            });
            const result = await response.json();
            if (response.ok) {
                setTasks(tasks.filter((_, i) => i !== index));
            } else {
                console.error('Failed to delete task:', result.error);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Filter tasks based on searchTerm
    const filteredTasks = tasks.filter(task =>
        task.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='Container'>
            <div className="addingTasks">
                <h1>{editIndex >= 0 ? 'Edit Task' : 'Add Task'}</h1>
                <div className="functions">
                    <input
                        type="text"
                        maxLength={65}
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add Task"
                    />
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                    />
                    <button onClick={addTask}>
                        <IoIosAddCircleOutline className='functionIcon' />
                    </button>
                </div>
            </div>
            <div className="editTasks">
                <h1>Tasks</h1>
                {filteredTasks.map((task, index) => (
                    <div key={task.id} className={`Tasks ${task.priority}`}>
                        <div>
                            <p style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.task}
                            </p>
                            <h6>{task.taskDate}</h6>
                        </div>
                        <div className="Ops">
                            <div className="operations">
                                <button onClick={() => toggleCompleteTask(index)}>
                                    <DoneIcon />
                                </button>
                                <button onClick={() => editTask(index)}>
                                    <EditIcon />
                                </button>
                                <button onClick={() => deleteTask(index)}>
                                    <DeleteForeverIcon />
                                </button>
                            </div>
                            <div className="priority">
                                <select
                                    value={task.priority}
                                    onChange={(e) => changeTaskPriority(index, e.target.value)}
                                >
                                    <option value="low">low</option>
                                    <option value="medium">medium</option>
                                    <option value="high">high</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToDo;
