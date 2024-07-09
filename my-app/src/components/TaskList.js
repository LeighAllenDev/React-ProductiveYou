import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks/');
                setTasks(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <h1>Task List</h1>
            <Link to="/tasks/new">
                <button>Add New Task</button>
            </Link>
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task.id}>
                        <h2>{task.task_name}</h2>
                        <p>{task.description}</p>
                    </div>
                ))
            ) : (
                <p>No tasks available.</p>
            )}
        </div>
    );
};

export default TaskList;
