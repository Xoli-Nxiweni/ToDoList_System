import { useState, useEffect } from 'react';
import './ToDo.css';
import { IoIosAddCircleOutline } from "react-icons/io";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { initializeDb, getTasks, addTask, updateTask, deleteTask } from '../../Db';

// eslint-disable-next-line react/prop-types
const ToDo = ({ simulateLoading, searchTerm }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    useEffect(() => {
        const fetchTasks = async () => {
            await initializeDb(); // Initialize DB
            const tasksFromDb = getTasks(); // Fetch tasks
            setTasks(tasksFromDb.map(([id, task, completed, priority, taskDate]) => ({
                id,
                task,
                taskDate,
                priority,
                completed: Boolean(completed)
            })));
        };
        fetchTasks();
    }, []);

    const handleAddOrUpdateTask = async () => {
        if (newTask.trim() === '') return;
        simulateLoading(true);

        if (editIndex >= 0) {
            const task = tasks[editIndex];
            updateTask(task.id, {
                name: newTask,
                taskDate: newDate,
                priority: newPriority,
                completed: task.completed
            });
            const updatedTasks = tasks.map((t, index) =>
                index === editIndex ? { ...t, task: newTask, taskDate: newDate, priority: newPriority } : t
            );
            setTasks(updatedTasks);
            setEditIndex(-1);
        } else {
            const newTaskId = await addTask(newTask, newDate, newPriority);
            setTasks([...tasks, { id: newTaskId, task: newTask, taskDate: newDate, priority: newPriority, completed: false }]);
        }

        setNewTask('');
        setNewDate('');
        setNewPriority('');
        simulateLoading(false);
    };

    const handleChangeTaskPriority = async (index, priority) => {
        const task = tasks[index];
        updateTask(task.id, {
            name: task.task,
            taskDate: task.taskDate,
            priority,
            completed: task.completed
        });
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, priority } : t
        );
        setTasks(updatedTasks);
    };

    const handleToggleCompleteTask = async (index) => {
        const task = tasks[index];
        updateTask(task.id, {
            name: task.task,
            taskDate: task.taskDate,
            priority: task.priority,
            completed: !task.completed
        });
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
    };

    const handleEditTask = (index) => {
        const task = tasks[index];
        setEditIndex(index);
        setNewTask(task.task);
        setNewDate(task.taskDate);
        setNewPriority(task.priority);
    };

    const handleDeleteTask = async (index) => {
        const taskId = tasks[index].id;
        deleteTask(taskId);
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

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
                    <button onClick={handleAddOrUpdateTask}>
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
                                <button onClick={() => handleToggleCompleteTask(index)}>
                                    <DoneIcon />
                                </button>
                                <button onClick={() => handleEditTask(index)}>
                                    <EditIcon />
                                </button>
                                <button onClick={() => handleDeleteTask(index)}>
                                    <DeleteForeverIcon />
                                </button>
                            </div>
                            <div className="priority">
                                <select
                                    value={task.priority}
                                    onChange={(e) => handleChangeTaskPriority(index, e.target.value)}
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
