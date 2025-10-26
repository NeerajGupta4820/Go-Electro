import { useState } from "react";
import { useFetchAllCategoriesQuery, useDeleteCategoryMutation } from "../../../redux/api/categoryAPI";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../../Loader/Spinner";
import { useNavigate } from "react-router-dom";

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
        toast.success("Category deleted successfully!", {
          className: "bg-green-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
        refetch();
        setIsModalOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        toast.error("Failed to delete category. Please try again.", {
          className: "bg-red-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
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
  if (isError) return <p className="text-red-500 text-center">Error loading categories.</p>;

  return (
    <div className="p-6">
      <ToastContainer toastClassName="min-w-[300px]" />
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h2> */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">Parent Category</TableHead>
              <TableHead className="text-left">Image</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesData?.data.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.parentCategory ? category.parentCategory.name : "None"}</TableCell>
                <TableCell>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openModal(category._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCategories;