import  { useState } from 'react';
import { useFetchAllCategoriesQuery, useDeleteCategoryMutation } from '../../../redux/api/categoryAPI';
import Spinner from '../../Loader/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllCategories.css'; 
import { useNavigate } from 'react-router-dom'; 

const AllCategories = () => {
  const navigate = useNavigate(); 
  const { data: categoriesData, isLoading, isError, refetch } = useFetchAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete).unwrap();
        toast.success('Category deleted successfully!'); 
        refetch(); 
        setIsModalOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        toast.error('Failed to delete category. Please try again.',error.message); 
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`); 
  };

  const openModal = (id) => {
    setCategoryToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error loading categories.</p>;

  return (
    <div className="all-categories-container">
      <ToastContainer />
      <h2 className="all-categories-heading">All Categories</h2>
      <div className="main-categories-table">
      <table className="categories-table">  
        <thead>
          <tr>
            <th>Name</th>
            <th>Parent Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoriesData?.data.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.parentCategory ? category.parentCategory.name : 'None'}</td>
              <td>
                {category.image ? (
                  <img src={category.image} alt={category.name} className="category-image" />
                ) : (
                  'No Image'
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(category._id)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => openModal(category._id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategories;
