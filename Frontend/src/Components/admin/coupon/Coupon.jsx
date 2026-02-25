import { useState } from "react";
import {
  useFetchAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../../redux/api/couponAPI";
import { useGetAllProductsQuery } from "../../../redux/api/productAPI";
import { ToastContainer, toast } from "react-toastify";
import { Button } from '@/Components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/Components/ui/dialog';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Edit, Trash2, List, Grid } from 'lucide-react';
import CouponForm from "./CouponForm";
import "./CouponPage.css";

const CouponPage = () => {
  const { data: coupons, isLoading, error, refetch } = useFetchAllCouponsQuery();
  const { data: products } = useGetAllProductsQuery();

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  // UI state to mimic AllCategories: list/grid
  const [viewMode, setViewMode] = useState('list');

  // modal for delete confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const handleAddCoupon = () => {
    setIsEditing(true);
    setEditCoupon(null);
  };

  const handleEditCoupon = (coupon) => {
    setIsEditing(true);
    // ensure products list is array of ids for the form
    setEditCoupon({
      ...coupon,
      products: (coupon.products || []).map((p) => p._id || p),
    });
  };

  const openDeleteModal = (id) => {
    setCouponToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCouponToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    try {
      await deleteCoupon(couponToDelete).unwrap();
      toast.success("Coupon deleted successfully", { theme: "dark" });
      if (refetch) refetch();
      closeModal();
    } catch (err) {
      toast.error(`Failed to delete coupon: ${err?.message || err}`, { theme: "dark" });
      console.error(err);
    }
  };

  const couponsList = coupons?.coupons || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {isEditing ? (
        <CouponForm
          products={products?.products || []}
          createCoupon={createCoupon}
          updateCoupon={updateCoupon}
          editCoupon={editCoupon}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* small status messages */}
          {isLoading && (
            <div className="py-4 text-sm text-gray-500">Loading coupons...</div>
          )}
          {error && (
            <div className="py-4 text-sm text-red-500">Failed to load coupons.</div>
          )}
          {/* header controls */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
              <p className="text-sm text-gray-600">Create and manage discount coupons</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-md overflow-hidden border">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-10 px-3 rounded-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-10 px-3 rounded-none border-l"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={handleAddCoupon} className="bg-black text-white shadow-md whitespace-nowrap">Add Coupon</Button>
            </div>
          </div>

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="px-4 py-3 text-left">Code</TableHead>
                        <TableHead className="px-4 py-3 text-left">Discount</TableHead>
                        <TableHead className="px-4 py-3 text-left">Products</TableHead>
                        <TableHead className="px-4 py-3 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {couponsList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-gray-500">No coupons available.</TableCell>
                        </TableRow>
                      ) : (
                        couponsList.map((coupon) => (
                          <TableRow key={coupon._id} className="hover:bg-gray-50 border-b cursor-pointer" onClick={() => handleEditCoupon(coupon)}>
                            <TableCell className="px-4 py-3 font-medium">{coupon.code}</TableCell>
                            <TableCell className="px-4 py-3">{coupon.discount}%</TableCell>
                            <TableCell className="px-4 py-3">{(coupon.products || []).length}</TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditCoupon(coupon); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); openDeleteModal(coupon._id); }}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {couponsList.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">No coupons available.</div>
              ) : (
                couponsList.map((coupon) => (
                  <div key={coupon._id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border" onClick={() => handleEditCoupon(coupon)}>
                    <div className="p-3 bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-medium">{coupon.code}</div>
                        <div className="text-xs text-gray-500">{coupon.discount}% off</div>
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <Badge variant="secondary" className="text-xs py-0">Products: {(coupon.products || []).length}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 p-2 pt-0">
                      <Button size="sm" variant="ghost" className="h-6 px-2 flex-1" onClick={(e) => { e.stopPropagation(); handleEditCoupon(coupon); }}>
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 flex-1 text-red-600" onClick={(e) => { e.stopPropagation(); openDeleteModal(coupon._id); }}>
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* DELETE CONFIRMATION DIALOG */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">Are you sure you want to delete this coupon? This action cannot be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>Yes, Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
        </div>
      </div>
    </div>
  );
};

export default CouponPage;
