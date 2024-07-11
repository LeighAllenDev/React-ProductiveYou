import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../App.module.css';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTask = useCallback(async () => {
        try {
            const response = await axiosReq.get(`/api/tasks/${id}/`);
            const taskData = response.data;
            setTask(taskData);

            const teamId = typeof taskData.team === 'object' ? taskData.team.id : taskData.team;
            if (teamId) {
                await fetchTeam(teamId);
            }

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
            setError('Error fetching team. Please try again later.');
        }
    };

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    if (loading) {
        return (
            <Container className={styles.App}>
                <Row>
                    <Col className="text-center">
                        <Spinner animation="border" />
                    </Col>
                </Row>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className={styles.App}>
                <Row>
                    <Col className="text-center">
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!task) {
        return (
            <Container className={styles.App}>
                <Row>
                    <Col className="text-center">
                        <Alert variant="warning">Task not found.</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className={styles.App}>
            <Row className="justify-content-center mt-5">
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body style={{ color: 'black' }}>
                            <Card.Title className="mb-3">{task.task_name}</Card.Title>
                            <Card.Text className="mb-2">{task.description}</Card.Text>
                            <Card.Text className="mb-2"><strong>Due Date:</strong> {task.due_date}</Card.Text>
                            <Card.Text className="mb-2"><strong>Urgent:</strong> {task.is_urgent ? 'Yes' : 'No'}</Card.Text>
                            <Card.Text className="mb-2"><strong>Completed:</strong> {task.completed ? 'Yes' : 'No'}</Card.Text>
                            {task.category && <Card.Text className="mb-2"><strong>Category:</strong> {task.category.name}</Card.Text>}
                            {team && <Card.Text className="mb-2"><strong>Team:</strong> {team.name}</Card.Text>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TaskDetail;
