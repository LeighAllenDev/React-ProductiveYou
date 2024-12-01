import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../App.module.css';

const TaskForm = ({ initialTask = null, onSuccess }) => {
    const isEditMode = Boolean(initialTask);

    const [task, setTask] = useState(
        initialTask || {
            task_name: '',
            description: '',
            is_urgent: false,
            completed: false,
            due_date: '',
            category: '',
            team: '',
        }
    );

    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories and teams for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, teamRes] = await Promise.all([
                    axiosReq.get('/api/categories/'),
                    axiosReq.get('/teams/'),
                ]);
                setCategories(categoryRes.data.results || []);
                setTeams(teamRes.data || []);
            } catch (error) {
                console.error('Error fetching categories or teams:', error);
            }
        };
        fetchData();
    }, []);

    // Reset form state for edit or create modes
    useEffect(() => {
        if (initialTask) {
            setTask(initialTask);
        } else {
            setTask({
                task_name: '',
                description: '',
                is_urgent: false,
                completed: false,
                due_date: '',
                category: '',
                team: '',
            });
            setSelectedFiles([]);
        }
    }, [initialTask]);

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
            for (let file of selectedFiles) {
                formData.append('files', file);
            }
        }

        try {
            setLoading(true);
            if (isEditMode) {
                await axiosReq.put(`/api/tasks/${initialTask.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axiosReq.post('/api/tasks/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving task:', error.response || error.message);
            alert(error.response?.data?.detail || 'Failed to save the task. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className={styles.App}>
            <h1 className="text-center">{isEditMode ? 'Edit Task' : 'Create Task'}</h1>
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
                <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </Form>
        </Container>
    );
};

export default TaskForm;
