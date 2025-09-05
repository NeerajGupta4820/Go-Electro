import { useState } from 'react';
import { useCreateCategoryMutation, useFetchAllCategoriesQuery } from '../../../redux/api/categoryAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../../Loader/Spinner';
import './CreateCategory.css'; 

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { data: categoriesData, isLoading: categoriesLoading, refetch } = useFetchAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    const cloudName = `${import.meta.env.VITE_CLOUD_NAME}`; 
    if (!file) {
      toast.error('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'IBM_Project'); 

    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      setImageUrl(response.data.secure_url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Category name is required.');
      return;
    }

    const categoryData = {
      name,
      parentCategory: parentCategory ? parentCategory : null, 
      image: imageUrl,
    };

    try {
      const response = await createCategory(categoryData).unwrap();
      if (response.success) {
        toast.success('Category created successfully!');
        await refetch(); 
        navigate('/admin/categories');
      } else {
        toast.error(response.message || 'Failed to create category.');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category.');
    }
  };

  return (
    <div className="create-category-container">
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Parent Category</label>
          {categoriesLoading ? (
            <Spinner /> 
          ) : (
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option value="">Select Parent Category</option>
              {categoriesData?.data.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label>Image</label>
          <input
            type="file"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
          {uploading && <Spinner />} 
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
