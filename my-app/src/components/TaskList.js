import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import styles from '../App.module.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks/');
                const taskData = response.data.results ? response.data.results : response.data;
                setTasks(Array.isArray(taskData) ? taskData : []);
                console.log('Fetched tasks:', taskData); // Debugging log
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <Container className={styles.App}>
            <h1 className="text-center my-4">Task List</h1>
            <Row className="mb-3">
                <Col className="text-center">
                    <Link to="/tasks/new">
                        <Button variant="primary">Add New Task</Button>
                    </Link>
                </Col>
            </Row>
            {tasks.length > 0 ? (
                <Row>
                    {tasks.map(task => (
                        <Col key={task.id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        <Link to={`/tasks/${task.id}`} className={styles.CardLink}>
                                            {task.task_name}
                                        </Link>
                                    </Card.Title>
                                    <Card.Text>{task.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row>
                    <Col className="text-center">
                        <p>No tasks available.</p>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default TaskList;
