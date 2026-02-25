import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchAllCategoriesQuery, useUpdateCategoryMutation, useGetCategoryByIdQuery } from '../../../redux/api/categoryAPI';
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { XCircle, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import axios from 'axios';

const generateImageFromName = (name) => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 200;

  // Set background
  context.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add text
  context.fillStyle = 'white';
  context.font = 'bold 40px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Get first letters of each word
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  context.fillText(initials, canvas.width/2, canvas.height/2);

  return canvas.toDataURL('image/png');
};

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    parentCategory: ''
  });
  const [uploading, setUploading] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const { data: categoriesData } = useFetchAllCategoriesQuery();
  const { data: categoryData, isLoading: isCategoryLoading } = useGetCategoryByIdQuery(id);
  console.log("categoryData",categoryData)
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (categoryData?.data) {
      setFormData({
        name: categoryData.data.name || '',
        image: categoryData.data.image || '',
        parentCategory: categoryData.data.parentCategory || 'none'
      });
    }
  }, [categoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParentCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      parentCategory: value
    }));
  };

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    setIsImageUploading(true);
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "IBM_Project");
    
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      setFormData(prev => ({ ...prev, image: res.data.secure_url }));
      setTempImage(null);
      setHasImageChanged(true);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      setTempImage(null);
      setHasImageChanged(false);
    } finally {
      setUploading(false);
      setIsImageUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
      uploadToCloudinary(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      image: generateImageFromName(formData.name)
    }));
    setTempImage(null);
    setHasImageChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const image = formData.image || generateImageFromName(formData.name);
      const categoryDataToSubmit = {
        ...formData,
        image,
        parentCategory: formData.parentCategory === 'none' ? '' : formData.parentCategory
      };
      const response = await updateCategory({
        id,
        categoryData: categoryDataToSubmit
      }).unwrap();

      if (response.success) {
        toast.success('Category updated successfully');
        navigate('/admin/categories');
      }
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update category');
    }
  };

  if (isCategoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Update Category</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="space-y-4">
              <div className="relative w-48 h-48 mx-auto border rounded-lg overflow-hidden">
                <img
                  src={tempImage || formData.image}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setFormData(prev => ({
                      ...prev,
                      image: generateImageFromName(formData.name)
                    }));
                  }}
                />
                {(formData.image || tempImage) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 focus:outline-none"
                    title="Delete image"
                  >
                    <XCircle className="w-6 h-6 text-red-500 hover:text-red-600" />
                  </button>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="text-white text-center">
                      {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2" />
                          <span className="text-sm">Click to upload</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentCategory">Parent Category</Label>
            <Select
              value={formData.parentCategory}
              onValueChange={handleParentCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categoriesData?.data
                  .filter(cat => cat._id !== id) // Prevent selecting self as parent
                  .map(category => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

            <Button 
              type="submit" 
              disabled={isUpdating || isImageUploading}
              className="w-full"
            >
              {(isUpdating || isImageUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUpdating ? 'Updating...' : isImageUploading ? 'Uploading Image...' : 'Update Category'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/admin/categories')}
              className="w-full"
            >
              Cancel
            </Button>
        </form>
      </Card>
    </div>
  );
};

export default UpdateCategory;
