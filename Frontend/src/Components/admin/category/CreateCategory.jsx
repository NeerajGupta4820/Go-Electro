import { useState } from "react";
import { useCreateCategoryMutation, useFetchAllCategoriesQuery } from "../../../redux/api/categoryAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Spinner from "../../Loader/Spinner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const { data: categoriesData, isLoading: categoriesLoading, refetch } = useFetchAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    if (!file) {
      toast.error("Please select an image to upload.", {
        className: "bg-red-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "IBM_Project");

    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      setImageUrl(response.data.secure_url);
      toast.success("Image uploaded successfully!", {
        className: "bg-green-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.", {
        className: "bg-red-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required.", {
        className: "bg-red-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
      return;
    }

    const categoryData = {
      name,
      parentCategory: parentCategory === "none" ? null : parentCategory,
      image: imageUrl,
    };

    try {
      const response = await createCategory(categoryData).unwrap();
      if (response.success) {
        toast.success("Category created successfully!", {
          className: "bg-green-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
        await refetch();
        navigate("/admin/categories");
      } else {
        toast.error(response.message || "Failed to create category.", {
          className: "bg-red-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category.", {
        className: "bg-red-500 text-white p-4 rounded-lg",
        progressClassName: "bg-white",
      });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <ToastContainer toastClassName="min-w-[300px]" />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
            placeholder="Enter category name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parentCategory">Parent Category</Label>
          {categoriesLoading ? (
            <Spinner />
          ) : (
            <Select
              value={parentCategory}
              onValueChange={setParentCategory}
            >
              <SelectTrigger id="parentCategory" className="w-full">
                <SelectValue placeholder="Select Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categoriesData?.data.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            onChange={(e) => handleUpload(e.target.files[0])}
            className="w-full"
            disabled={uploading}
          />
          {uploading && <Spinner />}
        </div>
        <Button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Create Category"}
        </Button>
      </form>
    </div>
  );
};

export default CreateCategory;