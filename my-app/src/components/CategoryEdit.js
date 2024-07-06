import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/api/categories/${categoryId}/`);
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
      await axios.put(`/api/categories/${categoryId}/`, { name: categoryName });
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
    <div>
      <h3 className="center-align light-blue-text text-darken-4">Edit Category</h3>
      <div className="row card-panel grey lighten-5">
        <form className="col s12" onSubmit={handleEditCategorySubmit}>
          <div className="row">
            <div className="input-field col s12">
              <i className="fas fa-folder-open prefix light-blue-text text-darken-4"></i>
              <input
                id="category_name"
                name="category_name"
                value={categoryName}
                minLength="3"
                maxLength="25"
                type="text"
                className="validate"
                required
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <label htmlFor="category_name" className="active">Category Name</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12 center-align">
              <button type="submit" className="btn-large light-blue darken-1">
                Update Category <i className="fas fa-save right"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
