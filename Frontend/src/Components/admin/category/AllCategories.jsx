// AllCategories.jsx - Updated grid image size to match AllProducts
import { useState } from 'react';
import { useDeleteCategoryMutation } from '../../../redux/api/categoryAPI';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ToastContainer, toast } from 'react-toastify';
import { Edit, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AllCategories = ({
  paginatedCategories = [],
  viewMode,
  onEdit,
  refetch,
}) => {
  const [deleteCategory] = useDeleteCategoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete).unwrap();
        toast.success('Category deleted successfully!');
        if (refetch) refetch(); // Use passed refetch
        setIsModalOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  const openModal = (id) => {
    setCategoryToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* === LIST VIEW (Table) === */}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="px-4 py-3 text-left">Name</TableHead>
                    <TableHead className="px-4 py-3 text-left">Parent Category</TableHead>
                    <TableHead className="w-24 px-4 py-3 text-left">Image</TableHead>
                    <TableHead className="px-4 py-3 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                        No categories available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCategories.map((category) => (
                      <TableRow
                        key={category._id}
                        className="hover:bg-gray-50 border-b cursor-pointer"
                        onClick={() => onEdit(category._id)}
                      >
                        <TableCell className="px-4 py-3 font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {category.parentCategory ? (
                            <Badge variant="secondary" className="text-xs">
                              {category.parentCategory.name}
                            </Badge>
                          ) : (
                            'None'
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 border-2 border-dashed rounded-md flex items-center justify-center text-xs text-gray-500">
                              No Image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(category._id);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(category._id);
                              }}
                            >
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

      {/* === GRID VIEW (Matching AllProducts image size) === */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedCategories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories available.
            </div>
          ) : (
            paginatedCategories.map((category) => (
              <div
                key={category._id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border"
                onClick={() => onEdit(category._id)}
              >
                <div className="aspect-square p-3 bg-gray-50">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-medium text-sm line-clamp-2">{category.name}</h3>
                  <div className="flex justify-between text-xs">
                    <Badge variant="secondary" className="text-xs py-0">
                      {category.parentCategory ? category.parentCategory.name : 'None'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 p-2 pt-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category._id);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 flex-1 text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(category._id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* === DELETE CONFIRMATION MODAL === */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllCategories;