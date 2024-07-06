import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
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

  return (
    <div>
      <h3 className="center-align light-blue-text text-darken-4">Categories</h3>

      {/* Add Category Form */}
      <div className="row card-panel grey lighten-5">
        <form className="col s12" onSubmit={handleAddCategorySubmit}>
          <div className="row">
            <div className="input-field col s12">
              <i className="fas fa-folder-open prefix light-blue-text text-darken-4"></i>
              <input
                id="new_category_name"
                name="new_category_name"
                value={newCategoryName}
                minLength="3"
                maxLength="25"
                type="text"
                className="validate"
                required
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <label htmlFor="new_category_name">New Category Name</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12 center-align">
              <button type="submit" className="btn-large light-blue darken-1">
                Add Category <i className="fas fa-plus-square right"></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="row">
        {categories.map((category) => (
          <div key={category.id} className="col s12 m6 l3">
            <div className="card light-blue darken-4 center-align">
              <div className="card-content white-text">
                <span className="card-title">{category.name}</span>
              </div>
              <div className="card-action">
                <Link
                  to={`/categories/edit/${category.id}`}
                  className="btn green accent-4"
                >
                  Edit
                </Link>
                <button className="btn red" onClick={() => handleDeleteCategory(category.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
