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
    const [newPriority, setNewPriority] = useState('low');
    const [editIndex, setEditIndex] = useState(-1);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3004/get-tasks');
            const result = await response.json();
            if (result.success) {
                setTasks(result.tasks);
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

        if (editIndex >= 0) {
            const updatedTask = { ...task, id: tasks[editIndex].id };
            try {
                const response = await fetch('http://localhost:3004/update-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTask)
                });
                const result = await response.json();
                if (result.success) {
                    const updatedTasks = tasks.map((t, index) =>
                        index === editIndex ? updatedTask : t
                    );
                    setTasks(updatedTasks);
                    setEditIndex(-1);
                } else {
                    console.error('Failed to update task:', result.error);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            try {
                const response = await fetch('http://localhost:3004/add-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task: newTask, taskDate: newDate })
                });
                const result = await response.json();
                if (result.success) {
                    setTasks([...tasks, { ...task, id: result.taskID }]);
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

    const changeTaskPriority = (index, priority) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, priority } : task
        );
        setTasks(updatedTasks);
    };

    const toggleCompleteTask = (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
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
        console.log(`Attempting to delete task with ID: ${taskId}`);
    
        try {
            const response = await fetch('http://localhost:3004/delete-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: taskId })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('Task deleted:', taskId);
                    const updatedTasks = tasks.filter((_, i) => i !== index);
                    setTasks(updatedTasks);
                } else {
                    console.error('Failed to delete task:', result.error);
                }
            } else {
                console.error('Failed to delete task. Response status:', response.status);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Filter tasks based on searchTerm
    const filteredTasks = tasks.filter(task =>
        // eslint-disable-next-line react/prop-types
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
