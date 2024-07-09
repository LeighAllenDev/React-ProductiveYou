import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../App.module.css'; // Assuming you have your CSS module for additional styles

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosReq.get(`/api/categories/${categoryId}/`);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error('Error fetching category:', error);
        alert('An error occurred while fetching the category, please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosReq.put(`/api/categories/${categoryId}/`, { name: categoryName });
      alert('Category updated successfully!');
      navigate('/categories'); // Navigate to categories list page
    } catch (error) {
      console.error('Error updating category:', error);
      alert('An error occurred while updating the category, please try again.');
    }
  };

  if (loading) {
    return <div>Loading category details...</div>;
  }

  return (
    <Container className={styles.App}>
      <h3 className="text-center light-blue-text text-darken-4">Edit Category</h3>
      <div className="card-panel grey lighten-5">
        <Form onSubmit={handleEditCategorySubmit} className={styles.Content}>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="category_name"
              value={categoryName}
              minLength="3"
              maxLength="25"
              required
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Update Category <i className="fas fa-save ml-1"></i>
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default EditCategory;
