import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { axiosReq } from '../api/axiosDefaults';

const EditTask = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axiosReq.get(`/api/tasks/${id}/`);
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [id]);

    if (!task) return <p>Loading...</p>;

    return <TaskForm initialTask={task} />;
};

export default EditTask;
