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
            await initializeDb();
            const tasksFromDb = await getTasks();
            setTasks(tasksFromDb.map(({ id, name, completed, priority, taskDate }) => ({
                id,
                task: name,
                taskDate,
                priority,
                completed: Boolean(completed),
            })));
        };
        fetchTasks();
    }, []);

    const handleAddOrUpdateTask = async () => {
        if (!newTask.trim()) return;
        simulateLoading(true);

        if (editIndex >= 0) {
            const task = tasks[editIndex];
            await updateTask(task.id, {
                name: newTask,
                taskDate: newDate,
                priority: newPriority,
                completed: task.completed
            });
            setTasks(prevTasks =>
                prevTasks.map((t, index) =>
                    index === editIndex ? { ...t, task: newTask, taskDate: newDate, priority: newPriority } : t
                )
            );
            setEditIndex(-1);
        } else {
            const newTaskId = await addTask(newTask, newDate, newPriority);
            setTasks([...tasks, { id: newTaskId, task: newTask, taskDate: newDate, priority: newPriority, completed: false }]);
        }

        clearInputFields();
        simulateLoading(false);
    };

    const clearInputFields = () => {
        setNewTask('');
        setNewDate('');
        setNewPriority('');
    };

    const handleToggleCompleteTask = async (index) => {
        const task = tasks[index];
        const updatedCompletedStatus = !task.completed;

        await updateTask(task.id, {
            name: task.task,
            taskDate: task.taskDate,
            priority: task.priority,
            completed: updatedCompletedStatus ? 1 : 0,
        });

        setTasks(prevTasks =>
            prevTasks.map((t, i) =>
                i === index ? { ...t, completed: updatedCompletedStatus } : t
            )
        );
    };
    // const handleToggleCompleteTask = async (index) => {
    //     const task = tasks[index];
    //     if (!task || !task.id) {
    //         console.error("Task or Task ID is undefined:", task);
    //         return;
    //     }
    
    //     const updatedCompletedStatus = !task.completed;
    
    //     await updateTask(task.id, {
    //         name: task.task,
    //         taskDate: task.taskDate,
    //         priority: task.priority,
    //         completed: updatedCompletedStatus ? 1 : 0,
    //     });
    // };
    

    const handleEditTask = (index) => {
        const task = tasks[index];
        setEditIndex(index);
        setNewTask(task.task);
        setNewDate(task.taskDate);
        setNewPriority(task.priority);
    };

    const handleDeleteTask = async (index) => {
        const taskId = tasks[index].id;
        await deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    };

    const handleChangeTaskPriority = async (index, priority) => {
        const task = tasks[index];
        await updateTask(task.id, {
            name: task.task,
            taskDate: task.taskDate,
            priority,
            completed: task.completed,
        });
        setTasks(prevTasks =>
            prevTasks.map((t, i) => (i === index ? { ...t, priority } : t))
        );
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
                    <button onClick={handleAddOrUpdateTask} aria-label="Add or Update Task">
                        <IoIosAddCircleOutline className='functionIcon' />
                    </button>
                </div>
            </div>
            <div className="editTasks">
                <h1>Tasks</h1>
                {filteredTasks.map((task, index) => (
                    <div key={`${task.id}-${index}`} className={`Tasks ${task.priority}`}>
                        <div>
                            <p style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.task}
                            </p>
                            <h6>{task.taskDate}</h6>
                        </div>
                        <div className="Ops">
                            <div className="operations">
                                <button onClick={() => handleToggleCompleteTask(index)} aria-label="Toggle Task Completion">
                                    <DoneIcon />
                                </button>
                                <button onClick={() => handleEditTask(index)} aria-label="Edit Task">
                                    <EditIcon />
                                </button>
                                <button onClick={() => handleDeleteTask(index)} aria-label="Delete Task">
                                    <DeleteForeverIcon />
                                </button>
                            </div>
                            <div className="priority">
                                <select
                                    value={task.priority}
                                    onChange={(e) => handleChangeTaskPriority(index, e.target.value)}
                                >
                                    <option value="">Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
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
