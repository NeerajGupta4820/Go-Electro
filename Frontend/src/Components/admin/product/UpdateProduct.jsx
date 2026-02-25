import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
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
import { Badge } from "@/Components/ui/badge";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(id);
  const { data: categories } = useFetchAllCategoriesQuery();
  const { data: coupons } = useFetchAllCouponsQuery();
  const [updateProduct] = useUpdateProductMutation();

  const categoriesList = Array.isArray(categories) ? categories : categories?.data || [];

  // All states in plain JavaScript
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [colorImages, setColorImages] = useState([{ color: "", images: [], _id: "" }]);
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [associatedCoupons, setAssociatedCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  // Load product data
  useEffect(() => {
    if (productData?.product) {
      const p = productData.product;
      setProductName(p.title || "");
      setPrice(p.price || "");
      setStock(p.stock || "");
      setDescription(p.description || "");
      setCategory(p.category?._id || p.category || "");
      setBrand(p.brand || "");
      setAssociatedCoupons(p.coupons || []);

      // Safely map images
      const safeImages = (p.images || []).map((img) => ({
        _id: img._id || "",
        color: img.color || "",
        images: Array.isArray(img.imageLinks) ? img.imageLinks : [],
      }));
      setColorImages(safeImages.length > 0 ? safeImages : [{ color: "", images: [], _id: "" }]);
    }
  }, [productData]);

  // Handle new image upload
  const handleImageChange = (color, files) => {
    if (!color || files.length === 0) return;

    setNewImages((prev) => {
      const filtered = prev.filter((item) => item.color !== color);
      return [...filtered, { color, images: files }];
    });
  };

  // Change color name
  const handleColorChange = (index, value) => {
    const updated = [...colorImages];
    updated[index].color = value;
    setColorImages(updated);
  };

  // Remove existing image
  const removeExistingImage = (colorIndex, imgIndex) => {
    const updated = [...colorImages];
    updated[colorIndex].images = updated[colorIndex].images.filter((_, i) => i !== imgIndex);
    setColorImages(updated);
  };

  // Add new color field
  const addColorField = () => {
    setColorImages((prev) => [...prev, { color: "", images: [], _id: "" }]);
  };

  // Upload images to Cloudinary
  const uploadImages = async (files) => {
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "IBM_Project");
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        return res.data.secure_url;
      } catch (err) {
        toast.error("Failed to upload image.");
        return null;
      }
    });

    setUploading(true);
    const urls = (await Promise.all(uploadPromises)).filter(Boolean);
    setUploading(false);
    return urls;
  };

  // Add coupon
  const addCoupon = () => {
    const coupon = coupons?.coupons.find((c) => c._id === selectedCoupon);
    if (coupon && !associatedCoupons.some((c) => c._id === coupon._id)) {
      setAssociatedCoupons((prev) => [...prev, coupon]);
      setSelectedCoupon("");
    }
  };

  // Remove coupon
  const removeCoupon = (couponId) => {
    setAssociatedCoupons((prev) => prev.filter((c) => c._id !== couponId));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating product...");

    // Upload new images
    let uploadedNewImages = [];
    for (const item of newImages) {
      if (item.images.length > 0) {
        const urls = await uploadImages(item.images);
        if (urls.length > 0) {
          uploadedNewImages.push({ color: item.color, imageLinks: urls });
        }
      }
    }

    // Merge existing + new images
    const finalImages = colorImages
      .map((ci) => {
        const newImg = uploadedNewImages.find((ni) => ni.color === ci.color);
        return {
          color: ci.color,
          imageLinks: [...ci.images, ...(newImg?.imageLinks || [])],
        };
      })
      .filter((img) => img.imageLinks.length > 0);

    const data = {
      title: productName,
      price: Number(price),
      stock: Number(stock),
      description,
      category,
      brand,
      images: finalImages,
      coupons: associatedCoupons.map((c) => c._id),
    };

    try {
      await updateProduct({ id, productData: data }).unwrap();
      toast.update(toastId, {
        render: "Product updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/admin/product");
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to update product.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
            Update Product
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
                    {categoriesList.map((cat) => (
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

            {/* Coupons */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Associated Coupons</Label>
              <div className="flex flex-wrap gap-2">
                {associatedCoupons.length > 0 ? (
                  associatedCoupons.map((coupon) => (
                    <Badge
                      key={coupon._id}
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium flex items-center gap-1"
                    >
                      {coupon.code} (-₹{coupon.discount})
                      <button
                        type="button"
                        onClick={() => removeCoupon(coupon._id)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No coupons added.</p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                  <SelectTrigger className="w-full md:w-64 h-10">
                    <SelectValue placeholder="Select coupon" />
                  </SelectTrigger>
                  <SelectContent>
                    {coupons?.coupons
                      ?.filter((c) => !associatedCoupons.some((ac) => ac._id === c._id))
                      .map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.code} - ₹{c.discount}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addCoupon}
                  disabled={!selectedCoupon}
                  size="sm"
                  className="h-10"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
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
                const newFiles = newImages
                  .find((ni) => ni.color === tempColorKey)
                  ?.images || [];

                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Color Name</Label>
                      <Input
                        value={item.color}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        placeholder="e.g. Black, Red"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Upload New Images</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files ? Array.from(e.target.files) : [];
                          handleImageChange(tempColorKey, files);
                        }}
                        className="h-10 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {/* Preview */}
                    <div className="md:col-span-2">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* Existing Images */}
                        {images.map((url, i) => (
                          <div key={`existing-${i}`} className="relative group">
                            <img
                              src={url}
                              alt={`preview-${i}`}
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx, i)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {/* New Uploaded Files */}
                        {newFiles.map((file, i) => (
                          <div key={`new-${i}`} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`new-${i}`}
                              className="w-16 h-16 object-cover rounded-md border border-dashed border-blue-400"
                            />
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Update Product
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

export default UpdateProduct;