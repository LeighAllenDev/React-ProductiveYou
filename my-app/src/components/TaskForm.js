import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';

const TaskForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({
        task_name: '',
        description: '',
        is_urgent: false,
        completed: false,
        due_date: null,
        category: '',
        team: '',
    });
    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axiosReq.get('/api/categories/');
            if (response.data && Array.isArray(response.data.results)) {
                setCategories(response.data.results);
            } else {
                console.error('Invalid response format for categories:', response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axiosReq.get('/teams/');
            if (response.data && Array.isArray(response.data)) {
                setTeams(response.data);
            } else {
                console.error('Invalid response format for teams:', response.data);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const fetchTask = useCallback(async () => {
        try {
            const response = await axiosReq.get(`/api/tasks/${id}/`);
            setTask(response.data);
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchCategories();
        fetchTeams();
        if (id) {
            fetchTask();
        }
    }, [id, fetchTask]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axiosReq.put(`/api/tasks/${id}/`, task);
            } else {
                await axiosReq.post('/api/tasks/', task);
            }
            navigate('/tasks');
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <div>
            <h1>{id ? 'Edit Task' : 'Create Task'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Task Name</label>
                    <input type="text" name="task_name" value={task.task_name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={task.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Due Date</label>
                    <input type="date" name="due_date" value={task.due_date} onChange={handleChange} />
                </div>
                <div>
                    <label>Category</label>
                    <select name="category" value={task.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Team</label>
                    <select name="team" value={task.team} onChange={handleChange} required>
                        <option value="">Select Team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Urgent</label>
                    <input type="checkbox" name="is_urgent" checked={task.is_urgent} onChange={handleChange} />
                </div>
                <div>
                    <label>Completed</label>
                    <input type="checkbox" name="completed" checked={task.completed} onChange={handleChange} />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default TaskForm;
