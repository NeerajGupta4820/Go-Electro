import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { useFetchAllCategoriesQuery } from "../../../redux/api/categoryAPI";
import { useFetchAllCouponsQuery } from "../../../redux/api/couponAPI";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(id);
  const { data: categories } = useFetchAllCategoriesQuery();
  const { data: coupons } = useFetchAllCouponsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [newImages, setNewImages] = useState([{ color: "", images: [] }]);
  const [colorImages, setColorImages] = useState([{ color: "", images: [], _id: "" }]);
  const [uploading, setUploading] = useState(false);
  const [associatedCoupons, setAssociatedCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  useEffect(() => {
    if (productData) {
      setProductName(productData.product.title);
      setPrice(productData.product.price);
      setStock(productData.product.stock);
      setDescription(productData.product.description);
      setCategory(productData.product.category);
      setBrand(productData.product.brand);
      setColorImages(
        productData.product.images || [{ color: "", images: [], _id: "" }]
      );
      setAssociatedCoupons(productData.product.coupons || []);
    }
  }, [productData]);

  const handleImageChange = (index, e, color) => {
    const files = Array.from(e.target.files);
    const colorExists = newImages.find((imageObj) => imageObj.color === color);

    let updatedImages;
    if (colorExists) {
      updatedImages = newImages.map((imageObj) =>
        imageObj.color === color ? { ...imageObj, images: [...files] } : imageObj
      );
    } else {
      updatedImages = [...newImages, { color: color, images: [...files] }];
    }
    setNewImages(updatedImages);
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

  const addColorImage = () => {
    setColorImages([...colorImages, { color: "", images: [], _id: "" }]);
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

  const mergeImagesByColor = (colorImages, productImages) => {
    let combinedImages = productImages.map((productImage) => ({
      color: productImage.color,
      imageLinks: productImage.imageLinks || [],
    }));

    colorImages.forEach((colorImage) => {
      const existingColor = combinedImages.find(
        (productImage) => productImage.color === colorImage.color
      );

      if (existingColor) {
        existingColor.imageLinks = [
          ...existingColor.imageLinks,
          ...(colorImage.imageLinks || []),
        ];
      } else {
        combinedImages.push({
          color: colorImage.color,
          imageLinks: colorImage.imageLinks || [],
        });
      }
    });

    return combinedImages;
  };

  const handleAddCoupon = () => {
    const newCoupon = coupons?.coupons.find((coupon) => coupon._id === selectedCoupon);
    if (newCoupon && !associatedCoupons.some((coupon) => coupon._id === newCoupon._id)) {
      setAssociatedCoupons([...associatedCoupons, newCoupon]);
      setSelectedCoupon("");
    } else {
      toast.error("Coupon already added or invalid.");
    }
  };

  const handleRemoveCoupon = (couponId) => {
    setAssociatedCoupons(associatedCoupons.filter((coupon) => coupon._id !== couponId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating product...");

    const productImages = [];
    for (const colorImage of newImages) {
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

    const newim = mergeImagesByColor(colorImages, productImages);
    const updatedProductData = {
      title: productName,
      price,
      stock,
      description,
      category,
      brand,
      images: newim,
      coupons: associatedCoupons.map((coupon) => coupon._id),
    };

    try {
      await updateProduct({ id, productData: updatedProductData }).unwrap();
      toast.update(toastId, {
        render: "Product updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/admin/product");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.update(toastId, {
        render: "Failed to update product.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (productLoading) return <div className="text-center text-blue-600 text-lg font-medium">Loading...</div>;

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 bg-white max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-700 md:text-3xl">
              Update Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="productName" className="block font-medium text-blue-700">
                    Product Name
                  </label>
                  <Input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                      !productName && "border-red-500"
                    }`}
                    placeholder="Enter product name"
                    aria-describedby="productName-error"
                  />
                  {!productName && (
                    <p id="productName-error" className="text-red-500 text-sm">
                      Product name is required
                    </p>
                  )}
                </div>
                {/* Price */}
                <div className="space-y-2">
                  <label htmlFor="price" className="block font-medium text-blue-700">
                    Price
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                      !price && "border-red-500"
                    }`}
                    placeholder="Enter price"
                    aria-describedby="price-error"
                  />
                  {!price && (
                    <p id="price-error" className="text-red-500 text-sm">
                      Price is required
                    </p>
                  )}
                </div>
                {/* Stock */}
                <div className="space-y-2">
                  <label htmlFor="stock" className="block font-medium text-blue-700">
                    Stock
                  </label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                      !stock && "border-red-500"
                    }`}
                    placeholder="Enter stock quantity"
                    aria-describedby="stock-error"
                  />
                  {!stock && (
                    <p id="stock-error" className="text-red-500 text-sm">
                      Stock is required
                    </p>
                  )}
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="category" className="block font-medium text-blue-700">
                    Category
                  </label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    required
                  >
                    <SelectTrigger
                      className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                        !category && "border-red-500"
                      }`}
                      aria-describedby="category-error"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.data.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!category && (
                    <p id="category-error" className="text-red-500 text-sm">
                      Category is required
                    </p>
                  )}
                </div>
                {/* Brand */}
                <div className="space-y-2">
                  <label htmlFor="brand" className="block font-medium text-blue-700">
                    Brand
                  </label>
                  <Input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                      !brand && "border-red-500"
                    }`}
                    placeholder="Enter brand name"
                    aria-describedby="brand-error"
                  />
                  {!brand && (
                    <p id="brand-error" className="text-red-500 text-sm">
                      Brand is required
                    </p>
                  )}
                </div>
              </div>
              {/* Description (Full Row) */}
              <div className="space-y-2">
                <label htmlFor="description" className="block font-medium text-blue-700">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                    !description && "border-red-500"
                  }`}
                  placeholder="Enter product description"
                  rows={4}
                  aria-describedby="description-error"
                />
                {!description && (
                  <p id="description-error" className="text-red-500 text-sm">
                    Description is required
                  </p>
                )}
              </div>
              {/* Associated Coupons */}
              <div className="space-y-2">
                <label className="block font-medium text-blue-700">Associated Coupons</label>
                <div className="space-y-2">
                  {associatedCoupons.length > 0 ? (
                    associatedCoupons.map((coupon) => (
                      <div
                        key={coupon._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <span className="text-blue-600 font-medium">{coupon.code} - ₹{coupon.discount}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveCoupon(coupon._id)}
                              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                              aria-label="Remove coupon"
                            >
                              <FaTrash className="h-3 w-3" />
                              Remove
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove this coupon</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No coupons associated yet.</p>
                  )}
                </div>
              </div>
              {/* Add Coupon */}
              <div className="space-y-2">
                <label className="block font-medium text-blue-700">Add Coupon</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={selectedCoupon}
                    onValueChange={setSelectedCoupon}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md">
                      <SelectValue placeholder="Select a coupon" />
                    </SelectTrigger>
                    <SelectContent>
                      {coupons?.coupons
                        .filter((coupon) => !associatedCoupons.some((ac) => ac._id === coupon._id))
                        .map((coupon) => (
                          <SelectItem key={coupon._id} value={coupon._id}>
                            {coupon.code} - ₹{coupon.discount}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={handleAddCoupon}
                        disabled={!selectedCoupon}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Add coupon"
                      >
                        <FaPlus className="h-4 w-4" />
                        Add Coupon
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add selected coupon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* Color and Images */}
              {colorImages.map((colorImage, index) => (
                <div key={colorImage._id || index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`color-${index}`} className="block font-medium text-blue-700">
                      Color
                    </label>
                    <Input
                      id={`color-${index}`}
                      type="text"
                      value={colorImage.color}
                      onChange={(e) => handleColorChange(index, e)}
                      placeholder="Enter color name"
                      required
                      className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md ${
                        !colorImage.color && "border-red-500"
                      }`}
                      aria-describedby={`color-${index}-error`}
                    />
                    {!colorImage.color && (
                      <p id={`color-${index}-error`} className="text-red-500 text-sm">
                        Color is required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`images-${index}`} className="block font-medium text-blue-700">
                      Upload New Images
                    </label>
                    <Input
                      id={`images-${index}`}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e, colorImage.color)}
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colorImage.imageLinks?.map((imageLink, i) => (
                        <div key={i} className="relative">
                          <img
                            src={imageLink}
                            alt={`preview-${i}`}
                            className="w-12 h-12 object-cover rounded-md border border-blue-200"
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className="absolute top-0 right-0 p-1 text-red-600 hover:text-red-800"
                                onClick={() => handleRemoveImage(index, i)}
                                aria-label="Remove image"
                              >
                                <FaTrash className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove this image</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {/* Add Color Button */}
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={addColorImage}
                      className="group w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 rounded-md transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                      aria-label="Add another color and images"
                    >
                      <FaPlus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                      Add Another Color and Images
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Another Color and Images</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {/* Submit Button */}
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                      aria-label="Update product"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className="h-5 w-5 transition-transform group-hover:rotate-90" />
                          Update Product
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Update Product</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default UpdateProduct;