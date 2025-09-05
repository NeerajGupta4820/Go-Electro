import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddProductMutation } from "../../../redux/api/productAPI";
import { useFetchAllCategoriesQuery } from "../../../redux/api/categoryAPI";
import {useFetchAllCouponsQuery} from "../../../redux/api/couponAPI";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateProduct.css";

const CreateProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [colorImages, setColorImages] = useState([{ color: "", images: [] }]);
  const [couponData, setCouponData] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useFetchAllCategoriesQuery();
  const [addProduct] = useAddProductMutation();
  const navigate = useNavigate();

  const {data:coupons} = useFetchAllCouponsQuery();

  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedColorImages = [...colorImages];
    updatedColorImages[index].images = files;
    setColorImages(updatedColorImages);
  };

  const handleColorChange = (index, e) => {
    const updatedColorImages = [...colorImages];
    updatedColorImages[index].color = e.target.value;
    setColorImages(updatedColorImages);
  };

  const addColorImage = () => {
    setColorImages([...colorImages, { color: "", images: [] }]);
  };

  const handleUpload = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadedImages = [];

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "IBM_Project");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        return response.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
        return null;
      }
    });

    setUploading(true);
    try {
      const results = await Promise.all(uploadPromises);
      uploadedImages.push(...results.filter((url) => url !== null));
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }

    return uploadedImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productImages = [];
    for (const colorImage of colorImages) {
      if (colorImage.color && colorImage.images.length > 0) {
        const uploadedImages = await handleUpload(colorImage.images);
        if (uploadedImages.length > 0) {
          productImages.push({
            color: colorImage.color,
            imageLinks: uploadedImages,
          });
        }
      }
    }

    const productData = {
      title: productName,
      price,
      stock,
      description,
      category,
      brand,
      images: productImages,
      coupon: selectedCoupon, 
    };

    try {
      await addProduct(productData).unwrap();
      toast.success("Product created successfully");
      navigate("/admin/product");
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product.");
    }
  };

  return (
    <div className="create-product-container">
      <h2>Create New Product</h2>
      <form
        className="create-product-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories?.data.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="coupon">Coupon Code</label>
          <select
            id="coupon"
            value={selectedCoupon ? selectedCoupon._id : ""}
            onChange={(e) => {
              const selected = couponData.find(coupon => coupon._id === e.target.value);
              setSelectedCoupon(selected);
            }}
          >
            <option value="">Select a coupon</option>
            {coupons && coupons.coupons.map(coupon => (
              <option key={coupon._id} value={coupon._id}>
                {coupon.code} - ₹{coupon.discount}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        {colorImages.map((colorImage, index) => (
          <div key={index} className="form-group color-image-group">
            <label htmlFor={`color-${index}`}>Color</label>
            <input
              type="text"
              id={`color-${index}`}
              value={colorImage.color}
              onChange={(e) => handleColorChange(index, e)}
              placeholder="Enter color name"
              required
            />
            <label htmlFor={`images-${index}`}>Upload Images</label>
            <input
              type="file"
              id={`images-${index}`}
              multiple
              accept="image/*"
              onChange={(e) => handleImageChange(index, e)}
              required
            />
            <div className="image-preview">
              {colorImage.images.map((image, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(image)}
                  alt={`preview-${i}`}
                  className="image-thumbnail"
                />
              ))}
            </div>
          </div>
        ))}
        <button type="button" className="add-color-btn" onClick={addColorImage}>
          Add Another Color and Images
        </button>
        <button className="submit-btn" type="submit" disabled={uploading}>
          <FaPlusCircle /> Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
