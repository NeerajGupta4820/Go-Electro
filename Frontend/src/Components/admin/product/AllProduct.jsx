import { useState, useEffect } from 'react';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../redux/api/productAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react'; // Using Lucide icon for close button

const AllProduct = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to delete product. Please try again.', error.message);
    }
  };

  const handleUpdateProduct = async (id) => {
    navigate(`update/${id}`);
  };

  if (isLoading) return <div className="text-center text-teal-600 text-lg font-medium">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-lg font-medium">Error fetching products</div>;

  const products = data?.products || [];

  const handleClosePopup = (e) => {
    if (e.target.classList.contains('product-popup')) {
      setSelectedProduct(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <ToastContainer />
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500 bg-white">
          <CardHeader>
            {/* <CardTitle className="text-3xl font-bold text-teal-700 md:text-4xl">All Products</CardTitle> */}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-teal-50">
                  <TableHead className="text-teal-700">Image</TableHead>
                  <TableHead className="text-teal-700">Name</TableHead>
                  <TableHead className="text-teal-700">Price</TableHead>
                  <TableHead className="text-teal-700">Description</TableHead>
                  <TableHead className="text-teal-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-teal-50 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <TableCell>
                      {product.images && product.images.length > 0 && product.images[0].imageLinks.length > 0 ? (
                        <img
                          src={product.images[0].imageLinks[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-md border border-teal-200"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No Image</span>
                      )}
                    </TableCell>
                    <TableCell className="text-teal-600 truncate max-w-[150px]" title={product.title}>
                      {product.title.slice(0, 15)}...
                    </TableCell>
                    <TableCell className="text-teal-600">Rs.{product.price}</TableCell>
                    <TableCell className="text-teal-600 truncate max-w-[200px]" title={product.description}>
                      {product.description.slice(0, 20)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleUpdateProduct(product._id);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition-all hover:scale-105"
                              aria-label="Edit product"
                            >
                              Edit
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Product</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleDelete(product._id);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-all hover:scale-105"
                              aria-label="Delete product"
                            >
                              Delete
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Product</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedProduct && (
          <div
            className="product-popup fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={handleClosePopup}
          >
            <Card className="relative w-full max-w-md bg-white shadow-xl border-l-4 border-teal-500">
              <Button
                variant="ghost"
                className="absolute top-3 right-3 text-teal-600 hover:text-teal-800 p-1"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
              >
                <X className="h-6 w-6" />
              </Button>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-teal-700">{selectedProduct.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[0].imageLinks.length > 0 ? (
                  <img
                    src={selectedProduct.images[0].imageLinks[0]}
                    alt={selectedProduct.title}
                    className="w-36 h-36 object-cover rounded-md mx-auto border border-teal-200"
                  />
                ) : (
                  <span className="text-gray-500 block text-center">No Image Available</span>
                )}
                <p className="text-teal-600">
                  <strong>Price:</strong> Rs.{selectedProduct.price}
                </p>
                <p className="text-teal-600">
                  <strong>Description:</strong> {selectedProduct.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AllProduct;