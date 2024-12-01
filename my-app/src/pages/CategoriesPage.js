import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import TaskDetail from '../components/TaskDetail';
import styles from '../App.module.css';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories/');
                if (response.data && Array.isArray(response.data.results)) {
                    setCategories(response.data.results);
                } else {
                    throw new Error('Unexpected response format: data.results is not an array');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const fetchTasks = async (categoryId, page = 1) => {
        try {
            const response = await axios.get(`/api/tasks/?category=${categoryId}&page=${page}`);
            console.log(`Fetching tasks for category ${categoryId}, page ${page}:`, response.data);
            setTasks(response.data.results || []);
            setTotalPages(response.data.total_pages || 1);
            setCurrentPage(response.data.current_page || 1);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            alert('Failed to fetch tasks. Please try again.');
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchTasks(category.id);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            fetchTasks(selectedCategory.id, currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            fetchTasks(selectedCategory.id, currentPage - 1);
        }
    };

    const handleTaskDetailClose = () => {
        setShowTaskDetail(false);
        setSelectedTaskId(null);
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`/api/categories/${categoryId}/`);
            const updatedCategories = categories.filter(category => category.id !== categoryId);
            setCategories(updatedCategories);
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('An error occurred while deleting the category, please try again.');
        }
    };

    const handleAddCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/categories/', { name: newCategoryName });
            const newCategory = response.data;
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            alert('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
            alert('An error occurred while adding the category, please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container className={styles.App}>
            <h3 className="text-center text-light">Categories</h3>
            <div className={`card-panel ${styles.Content} mb-4`}>
                <Form onSubmit={handleAddCategorySubmit}>
                    <Form.Group>
                        <Form.Label>New Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newCategoryName}
                            minLength="3"
                            maxLength="25"
                            required
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-3">
                        Add Category
                    </Button>
                </Form>
            </div>

            <Row>
                {categories.map((category) => (
                    <Col key={category.id} sm={12} md={6} lg={4} className="mb-4">
                        <Card className={styles.cardCustom}>
                            <Card.Body className="text-center">
                                <Card.Title
                                    onClick={() => handleCategoryClick(category)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {category.name}
                                </Card.Title>
                                <Link
                                    to={`/categories/edit/${category.id}`}
                                    className="btn btn-success me-2"
                                >
                                    Edit
                                </Link>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedCategory && (
                <>
                    <h4 className="mt-4 text-center text-light">
                        Tasks in Selected Category: {selectedCategory.name}
                    </h4>
                    {tasks.length > 0 ? (
                        <>
                            <Row>
                                {tasks.map((task) => (
                                    <Col key={task.id} sm={12} md={6} lg={4} className="mb-4">
                                        <Card
                                            className={styles.cardCustom}
                                            onClick={() => {
                                                setSelectedTaskId(task.id);
                                                setShowTaskDetail(true);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card.Body>
                                                <Card.Title>{task.task_name}</Card.Title>
                                                <Card.Text>{task.description}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <Row className="justify-content-center mt-4">
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
                            </Row>
                        </>
                    ) : (
                        <div className="text-center mt-4 text-light">No tasks in this category.</div>
                    )}
                </>
            )}

            <Modal
                show={showTaskDetail}
                onHide={handleTaskDetailClose}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTaskId && (
                        <TaskDetail
                            id={selectedTaskId}
                            onClose={handleTaskDetailClose}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default CategoriesPage;
