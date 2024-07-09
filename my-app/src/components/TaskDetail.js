import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTask = useCallback(async () => {
        try {
            const response = await axiosReq.get(`/api/tasks/${id}/`);
            setTask(response.data);
            fetchTeam(response.data.team);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching task:', error);
            setError('Error fetching task. Please try again later.');
            setLoading(false);
        }
    }, [id]);

    const fetchTeam = async (teamId) => {
        try {
            const response = await axiosReq.get(`/teams/${teamId}/`);
            setTeam(response.data);
        } catch (error) {
            console.error('Error fetching team:', error);
            setError('Error fetching team. Please try again later.'); // Update error state
        }
    };

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!task || !team) {
        return <div>Task or team not found.</div>;
    }

    return (
        <div>
            <h1>{task.task_name}</h1>
            <p>{task.description}</p>
            <p>Due Date: {task.due_date}</p>
            <p>Urgent: {task.is_urgent ? 'Yes' : 'No'}</p>
            <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
            <p>Category: {task.category.name}</p>
            <p>Team: {team.name}</p>
        </div>
    );
};

export default TaskDetail;
