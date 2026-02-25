import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { ArrowLeft } from 'lucide-react';
import "./CouponForm.css";

const CouponForm = ({
  products,
  createCoupon,
  updateCoupon,
  editCoupon,
  onClose,
}) => {
  const [couponData, setCouponData] = useState(
    editCoupon || { code: "", discount: "", products: [] }
  );

  const toggleProductSelection = (productId) => {
    const updatedProducts = couponData.products.includes(productId)
      ? couponData.products.filter((id) => id !== productId)
      : [...couponData.products, productId];
    setCouponData({ ...couponData, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCoupon) {
        await updateCoupon(couponData).unwrap();
        toast.success("Updated successfully!", { theme: "dark" });
      } else {
        await createCoupon(couponData).unwrap();
        toast.success("Added successfully!", { theme: "dark" });
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to save coupon: ${error?.message || error}`, { theme: "dark" });
      console.error(error);
    }
  };

  return (
  <div className="p-6 max-w-4xl w-full mx-auto bg-white shadow-md rounded-lg">
      <ToastContainer toastClassName="min-w-[300px]" />
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onClose} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">{editCoupon ? "Update Coupon" : "Add New Coupon"}</h2>
        <div />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="code">Coupon Code</Label>
          <Input
            id="code"
            type="text"
            placeholder="Coupon Code"
            value={couponData.code}
            onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            placeholder="Discount Amount"
            value={couponData.discount}
            onChange={(e) => setCouponData({ ...couponData, discount: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="w-40 bg-black">{editCoupon ? "Update Coupon" : "Add Coupon"}</Button>
        </div>

  <div className="product-selection w-full max-w-3xl mx-auto py-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-lg">Select Products</h4>
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 mr-2"
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    const allIds = products.map(p => p._id);
                    setCouponData({ ...couponData, products: allIds });
                  } else {
                    setCouponData({ ...couponData, products: [] });
                  }
                }}
                checked={products.length > 0 && couponData.products.length === products.length}
              />
              Select all
            </label>
          </div>

          <div className="overflow-auto mt-2 hide-scrollbar max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="text-left text-xs text-gray-500 bg-white">
                  <TableHead className="w-16 px-2 py-2">Select</TableHead>
                  <TableHead className="px-2 py-2">Title</TableHead>
                  <TableHead className="w-28 px-2 py-2">Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-gray-50">
                    <TableCell className="px-2 py-3 align-top">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={couponData.products.includes(product._id)}
                        onChange={() => toggleProductSelection(product._id)}
                      />
                    </TableCell>
                    <TableCell className="px-2 py-3 align-top">{product.title}</TableCell>
                    <TableCell className="px-2 py-3 align-top">
                      <img
                        src={product.images?.[0]?.imageLinks?.[0]}
                        className="w-20 h-14 object-cover rounded"
                        alt="product"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
