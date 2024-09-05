import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../App.module.css';

const TaskForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({
        task_name: '',
        description: '',
        is_urgent: false,
        completed: false,
        due_date: '',
        category: '',
        team: '',
    });
    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

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

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('task_name', task.task_name);
        formData.append('description', task.description);
        formData.append('is_urgent', task.is_urgent);
        formData.append('completed', task.completed);
        formData.append('due_date', task.due_date);
        formData.append('category', task.category);
        formData.append('team', task.team);

        if (selectedFiles.length > 0) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('files', selectedFiles[i]);
            }
        }

        try {
            if (id) {
                await axiosReq.put(`/api/tasks/${id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axiosReq.post('/api/tasks/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            navigate('/tasks');
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <Container className={styles.App}>
            <h1 className="text-center">{id ? 'Edit Task' : 'Create Task'}</h1>
            <Form onSubmit={handleSubmit} className={styles.Content}>
                <Form.Group controlId="taskName">
                    <Form.Label>Task Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="task_name"
                        value={task.task_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="dueDate">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="due_date"
                        value={task.due_date || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as="select"
                        name="category"
                        value={task.category}
                        onChange={handleChange}
                        required
                        className="mb-3"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="team">
                    <Form.Label>Team</Form.Label>
                    <Form.Control
                        as="select"
                        name="team"
                        value={task.team}
                        onChange={handleChange}
                        required
                        className="mb-3"
                    >
                        <option value="">Select Team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="isUrgent">
                    <Form.Check
                        type="checkbox"
                        name="is_urgent"
                        label="Urgent"
                        checked={task.is_urgent}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="completed">
                    <Form.Check
                        type="checkbox"
                        name="completed"
                        label="Completed"
                        checked={task.completed}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="files">
                    <Form.Label>Upload Files</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        name="files"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">
                    Save
                </Button>
            </Form>
        </Container>
    );
};

export default TaskForm;
