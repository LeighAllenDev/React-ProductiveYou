import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskDetail from './TaskDetail';
import styles from '../App.module.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const fetchTasks = async (page) => {
        try {
            console.log(`Fetching tasks for page_size=${page}`);
            const response = await axios.get(`/api/tasks/?page_size=${page}`);
            console.log("Fetched Tasks:", response.data);
            setTasks(response.data.results || []);
            setTotalPages(response.data.total_pages || 1);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleTaskFormSubmit = () => {
        setShowTaskForm(false);
        setSelectedTaskId(null);
        fetchTasks(currentPage); // Refresh current page
    };

    const handleTaskDeleted = () => {
        setShowTaskDetail(false);
        fetchTasks(currentPage); // Refresh tasks after deletion
    };

    return (
        <Container className={styles.App}>
            <h1 className="text-center my-4">Task List</h1>
            <Row className="mb-3">
                <Col className="text-center">
                    <Button
                        onClick={() => {
                            setShowTaskForm(true);
                            setSelectedTaskId(null);
                        }}
                        variant="primary"
                    >
                        Add New Task
                    </Button>
                </Col>
            </Row>
            {tasks.length > 0 ? (
                <>
                    <Row>
                        {tasks.map(task => (
                            <Col key={task.id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body style={{ color: 'black' }}>
                                        <Card.Title>
                                            <span
                                                className={styles.CardLink}
                                                onClick={() => {
                                                    setSelectedTaskId(task.id);
                                                    setShowTaskDetail(true);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {task.task_name}
                                            </span>
                                        </Card.Title>
                                        <Card.Text>{task.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Row className="justify-content-center mt-4">
                        <Col className="text-center">
                            <Button
                                variant="secondary"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="mx-3">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </Col>
                    </Row>
                </>
            ) : (
                <Row>
                    <Col className="text-center">
                        <p>No tasks available.</p>
                    </Col>
                </Row>
            )}

            {/* Task Form Modal */}
            <Modal show={showTaskForm} onHide={() => setShowTaskForm(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTaskId ? 'Edit Task' : 'Add Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskForm
                        initialTask={selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null}
                        onSuccess={handleTaskFormSubmit}
                    />
                </Modal.Body>
            </Modal>

            {/* Task Detail Modal */}
            <Modal
                show={showTaskDetail}
                onHide={() => setShowTaskDetail(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTaskId ? (
                        <TaskDetail id={selectedTaskId} onClose={handleTaskDeleted} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default TaskList;
