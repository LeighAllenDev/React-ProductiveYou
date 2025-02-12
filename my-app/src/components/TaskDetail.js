import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Alert, Spinner, Button, Modal } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import TaskForm from "./TaskForm";
import { useCurrentUser } from "../contexts/CurrentUser";
import styles from "../App.module.css";

const TaskDetail = ({ id: propId, onClose }) => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();

    const taskId = propId || routeId;
    const currentUser = useCurrentUser();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskError, setTaskError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [feedback, setFeedback] = useState("");

    const fetchTask = useCallback(async () => {
        try {
            const response = await axiosReq.get(`/api/tasks/${taskId}/`);
            setTask(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                setTaskError("Task not found.");
            } else {
                setTaskError("Error fetching task. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    const handleMarkCompleted = async () => {
        setUpdating(true);
        try {
            await axiosReq.patch(`/api/tasks/${taskId}/`, {
                completed: !task.completed,
            });
            setTask((prevTask) => ({ ...prevTask, completed: !prevTask.completed }));
            setFeedback("Task updated successfully.");
        } catch (error) {
            console.error("Error updating task:", error.response || error.message);
            alert(error.response?.data?.detail || "Failed to mark the task as complete/incomplete.");
        } finally {
            setUpdating(false);
            setTimeout(() => setFeedback(""), 3000); // Clear feedback message
        }
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchTask(); // Refresh task details after editing
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axiosReq.delete(`/api/tasks/${taskId}/`);
            alert("Task deleted successfully.");
            if (onClose) {
                onClose(); // Notify parent to refresh list and close modal
            } else {
                navigate("/tasks");
            }
        } catch (error) {
            console.error("Error deleting task:", error.response || error.message);
            alert("Failed to delete task. Please try again.");
        }
    };

    const handleBack = () => {
        if (onClose) {
            onClose(); // Close modal if provided
        } else {
            navigate("/tasks"); // Navigate back to task list if not in modal
        }
    };

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

    if (taskError) {
        return (
            <Container className={styles.App}>
                <Row>
                    <Col className="text-center">
                        <Alert variant="danger">{taskError}</Alert>
                        <Button variant="secondary" onClick={handleBack}>
                            Back to Tasks
                        </Button>
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
                        <Button variant="secondary" onClick={handleBack}>
                            Back to Tasks
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    const isOwner = currentUser?.pk === task.owner;
    const isTeamMember = task.team?.users?.some((user) => user.id === currentUser?.pk);

    return (
        <Container className={styles.App}>
            {feedback && <Alert variant="success">{feedback}</Alert>}
            <Row className="justify-content-center mt-5">
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body style={{ color: "black" }}>
                            <Card.Title className="mb-3">{task.task_name}</Card.Title>
                            <Card.Text className="mb-2">{task.description}</Card.Text>
                            <Card.Text className="mb-2">
                                <strong>Due Date:</strong> {task.due_date || "Not set"}
                            </Card.Text>
                            <Card.Text className="mb-2">
                                <strong>Urgent:</strong> {task.is_urgent ? "Yes" : "No"}
                            </Card.Text>
                            <Card.Text className="mb-2">
                                <strong>Completed:</strong> {task.completed ? "Yes" : "No"}
                            </Card.Text>
                            <Card.Text className="mb-2">
                                <strong>Category:</strong> {task.category?.name || "No category assigned"}
                            </Card.Text>
                            <Card.Text className="mb-2">
                                <strong>Team:</strong> {task.team?.name || "No team assigned"}
                            </Card.Text>
                            {task.files.length > 0 && (
                                <Card.Text className="mb-2">
                                    <strong>Files:</strong>
                                    <ul>
                                        {task.files.map((file) => (
                                            <li key={file.id}>
                                                <a href={file.file} target="_blank" rel="noopener noreferrer">
                                                    {file.file.split("/").pop()}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                    {(isOwner || isTeamMember) && (
                        <Button
                            variant={task.completed ? "success" : "warning"}
                            className="me-2"
                            onClick={handleMarkCompleted}
                            disabled={updating}
                        >
                            {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
                        </Button>
                    )}
                    {isOwner && (
                        <>
                            <Button
                                variant="primary"
                                className="me-2"
                                onClick={() => setShowEditModal(true)}
                            >
                                Edit Task
                            </Button>
                            <Button
                                variant="danger"
                                className="me-2"
                                onClick={handleDelete}
                            >
                                Delete Task
                            </Button>
                        </>
                    )}
                    <Button variant="secondary" onClick={handleBack}>
                        Back to Tasks
                    </Button>
                </Col>
            </Row>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskForm initialTask={task} onSuccess={handleEditSuccess} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default TaskDetail;
