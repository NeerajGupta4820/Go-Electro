// AllProduct.jsx - Now a display-only component that receives props
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent,CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MoreHorizontal, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const AllProduct = ({
  viewMode,
  paginatedProducts,
  onProductClick,
  onActionClick,
  onUpdate,
  onDelete,
  selectedProduct,
  setSelectedProduct,
  actionProduct,
  setActionProduct,
  getCategoryName,
  truncateText,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleUpdate = (id) => {
    onUpdate(id);
  };

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
    setActionProduct(null); // Close action popup if open
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await onDelete(productToDelete);
      closeDeleteModal();
    }
  };

  return (
    <>
      {/* === LIST VIEW === */}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-16 px-4 py-3">Img</TableHead>
                    <TableHead className="px-4 py-3">Name</TableHead>
                    <TableHead className="px-4 py-3">Price</TableHead>
                    <TableHead className="px-4 py-3">Category</TableHead>
                    <TableHead className="px-4 py-3">Stock</TableHead>
                    <TableHead className="px-4 py-3 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        className="hover:bg-blue-50/30 cursor-pointer border-b"
                        onClick={(e) => {
                          if (e.target.closest('button')) return;
                          onProductClick(product);
                        }}
                      >
                        <TableCell className="px-4 py-3">
                          {product.images?.[0]?.imageLinks?.[0] ? (
                            <img
                              src={product.images[0].imageLinks[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 border-2 border-dashed rounded-md flex items-center justify-center text-xs">
                              No
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-medium">
                          {truncateText(product.title, 30)}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className="font-bold text-green-600">₹{product.price}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryName(product.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
                            {product.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onActionClick(product);
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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

      {/* === GRID VIEW === */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found.
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border"
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-square p-3 bg-gray-50">
                  {product.images?.[0]?.imageLinks?.[0] ? (
                    <img
                      src={product.images[0].imageLinks[0]}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>
                  <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                  <div className="flex justify-between text-xs">
                    <Badge variant="secondary" className="text-xs py-0">
                      {getCategoryName(product.category)}
                    </Badge>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs py-0">
                      {product.stock}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/80 backdrop-blur"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick(product);
                  }}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* === DETAILS MODAL === */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProduct(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-2xl" onClick={e => e.stopPropagation()}>
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
                <p className="text-xs text-gray-500">ID: {selectedProduct._id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(null)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-center">
                {selectedProduct.images?.[0]?.imageLinks?.[0] ? (
                  <img src={selectedProduct.images[0].imageLinks[0]} alt="" className="w-40 h-40 object-cover rounded-xl border" />
                ) : (
                  <div className="w-40 h-40 bg-gray-100 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Price:</span> <span className="text-xl font-bold text-green-600">₹{selectedProduct.price}</span></div>
                <div><span className="font-medium">Category:</span> <Badge variant="secondary">{getCategoryName(selectedProduct.category)}</Badge></div>
                <div><span className="font-medium">Stock:</span> <Badge variant={selectedProduct.stock > 0 ? 'default' : 'destructive'}>{selectedProduct.stock} units</Badge></div>
                <div><span className="font-medium">ID:</span> <code className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedProduct._id}</code></div>
              </div>
              <div>
                <span className="font-medium block mb-1">Description:</span>
                <p className="bg-gray-50 p-3 rounded-lg text-sm">{selectedProduct.description || '—'}</p>
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button className="flex-1" onClick={() => handleUpdate(selectedProduct._id)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => openDeleteModal(selectedProduct._id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setSelectedProduct(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* === ACTION POPUP === */}
      {actionProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setActionProduct(null)}>
          <Card className="w-full max-w-xs p-4 shadow-xl rounded-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Actions</h3>
              <Button variant="ghost" size="icon" onClick={() => setActionProduct(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-3">{actionProduct.title}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => handleUpdate(actionProduct._id)}>
                <Edit className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button size="sm" variant="destructive" className="flex-1" onClick={() => openDeleteModal(actionProduct._id)}>
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* === DELETE CONFIRMATION DIALOG === */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeDeleteModal}>
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

export default AllProduct;