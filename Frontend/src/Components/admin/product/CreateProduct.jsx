import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddProductMutation } from "../../../redux/api/productAPI";
import { useFetchAllCategoriesQuery } from "../../../redux/api/categoryAPI";
import { useFetchAllCouponsQuery } from "../../../redux/api/couponAPI";
import { Loader2, Plus, Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";

const CreateProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [colorImages, setColorImages] = useState([{ color: "", images: [] }]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useFetchAllCategoriesQuery();
  const [addProduct] = useAddProductMutation();
  const navigate = useNavigate();
  const { data: coupons } = useFetchAllCouponsQuery();

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

  const handleRemoveImage = (colorIndex, imageIndex) => {
    const updatedColorImages = [...colorImages];
    updatedColorImages[colorIndex].images = updatedColorImages[colorIndex].images.filter(
      (_, idx) => idx !== imageIndex
    );
    setColorImages(updatedColorImages);
  };

  const addColorField = () => {
    setColorImages([...colorImages, { color: "", images: [] }]);
  };

  const removeColorSection = (index) => {
    if (colorImages.length > 1) {
      const updated = colorImages.filter((_, i) => i !== index);
      setColorImages(updated);
    }
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
      coupon: selectedCoupon?._id || null,
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
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
            Create Product
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                <Input
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="h-11"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="h-11"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.data?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="h-11"
                  placeholder="Enter brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon" className="text-sm font-medium">Coupon (Optional)</Label>
                <Select
                  value={selectedCoupon?._id || "none"}
                  onValueChange={(value) => {
                    if (value === "none") {
                      setSelectedCoupon(null);
                    } else {
                      const selected = coupons?.coupons.find((c) => c._id === value);
                      setSelectedCoupon(selected || null);
                    }
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select coupon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Coupon</SelectItem>
                    {coupons?.coupons?.map((coupon) => (
                      <SelectItem key={coupon._id} value={coupon._id}>
                        {coupon.code} - ₹{coupon.discount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-medium">Description</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="resize-none"
                placeholder="Describe the product..."
              />
            </div>

            {/* Color & Images */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Images by Color</Label>
                <Button type="button" onClick={addColorField} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Color
                </Button>
              </div>

              {colorImages.map((item, idx) => {
                const images = Array.isArray(item.images) ? item.images : [];
                const tempColorKey = item.color || `temp-${idx}`;

                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Color {idx + 1}</h4>
                      {colorImages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColorSection(idx)}
                          className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Color Name</Label>
                      <Input
                        value={item.color}
                        onChange={(e) => handleColorChange(idx, e)}
                        placeholder="e.g. Black, Red"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Upload Images</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageChange(idx, e)}
                        className="h-10 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {/* Preview */}
                    <div className="md:col-span-2">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {images.map((file, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${i}`}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx, i)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={uploading}
                className="w-full md:w-auto px-8 h-11 text-base font-medium"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct;