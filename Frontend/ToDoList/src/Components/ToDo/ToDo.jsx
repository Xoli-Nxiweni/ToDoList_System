import { useState, useEffect } from 'react';
import './ToDo.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getTasks, addTask as dbAddTask, updateTask as dbUpdateTask, deleteTask as dbDeleteTask } from '../../Db';

const ToDo = ({ simulateLoading, searchTerm }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = getTasks();
            setTasks(fetchedTasks.map(task => ({
                id: task[0],
                task: task[1],
                completed: task[2],
                priority: task[4] || 'low',  // Assume default priority as 'low' for existing tasks
                taskDate: task[3] || new Date().toISOString().split('T')[0]  // Default date
            })));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // const addTask = async () => {
    //     if (newTask.trim() === '') return;
    //     simulateLoading(true);

    //     const task = { task: newTask, taskDate: newDate, priority: newPriority, completed: false };

    //     if (editIndex >= 0) {
    //         const updatedTask = { ...task, id: tasks[editIndex].id };
    //         try {
    //             await dbUpdateTask(updatedTask.id, updatedTask);
    //             const updatedTasks = tasks.map((t, index) =>
    //                 index === editIndex ? updatedTask : t
    //             );
    //             setTasks(updatedTasks);
    //             setEditIndex(-1);
    //         } catch (error) {
    //             console.error('Error updating task:', error);
    //         }
    //     } else {
    //         try {
    //             await dbAddTask(task.task, task.taskDate, task.priority);
    //             fetchTasks();  // Re-fetch tasks to get the correct ID from the database
    //         } catch (error) {
    //             console.error('Error adding task:', error);
    //         }
    //     }

    //     setNewTask('');
    //     setNewDate('');
    //     setNewPriority('');
    //     simulateLoading(false);
    // };

    const addTask = async () => {
        if (newTask.trim() === '') return;
        simulateLoading(true);
    
        const task = { task: newTask, taskDate: newDate, priority: newPriority, completed: false };
    
        if (editIndex >= 0) {
            const updatedTask = { ...task, id: tasks[editIndex].id };
            try {
                await dbUpdateTask(updatedTask.id, updatedTask);
                const updatedTasks = tasks.map((t, index) =>
                    index === editIndex ? updatedTask : t
                );
                setTasks(updatedTasks);
                setEditIndex(-1);
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            try {
                await dbAddTask(newTask, newDate, newPriority);
                fetchTasks();  // Re-fetch tasks to get the correct ID from the database
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    
        setNewTask('');
        setNewDate('');
        setNewPriority('');
        simulateLoading(false);
    };
    

    const changeTaskPriority = async (index, priority) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, priority } : task
        );
        setTasks(updatedTasks);
        try {
            const updatedTask = updatedTasks[index];
            await dbUpdateTask(updatedTask.id, updatedTask);
        } catch (error) {
            console.error('Error updating task priority:', error);
        }
    };

    const toggleCompleteTask = async (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        try {
            const updatedTask = updatedTasks[index];
            await dbUpdateTask(updatedTask.id, updatedTask);
        } catch (error) {
            console.error('Error toggling task completion:', error);
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
        console.log(`Attempting to delete task with ID: ${taskId}`);

        try {
            await dbDeleteTask(taskId);
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
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
                                    <option value="">priority</option>
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
