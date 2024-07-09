import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import styles from '../App.module.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories/');
        // Check if response has a 'results' array
        if (response.data && Array.isArray(response.data.results)) {
          setCategories(response.data.results); // Set categories to 'results'
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className={styles.App}>
      <h3 className="text-center text-light">Categories</h3>

      {/* Add Category Form */}
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

      {/* Categories List */}
      <Row>
        {categories.map((category) => (
          <Col key={category.id} sm={12} md={6} lg={4} className="mb-4">
            <Card className={styles.cardCustom}>
              <Card.Body className="text-center">
                <Card.Title>{category.name}</Card.Title>
                <Link to={`/categories/edit/${category.id}`} className="btn btn-success me-2">
                  Edit
                </Link>
                <Button variant="danger" onClick={() => handleDeleteCategory(category.id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoriesPage;
