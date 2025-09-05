import { useState, useEffect } from 'react';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../redux/api/productAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllProduct.css';
import { useNavigate } from 'react-router-dom';

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
      toast.error('Failed to delete product. Please try again.',error.message);
    }
  };

  const handleUpdateProduct = async (id) =>{
    navigate(`update/${id}`)
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching products</div>;

  const products = data?.products || [];

  const handleClosePopup = (e) => {
    if (e.target.classList.contains('product-popup')) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="product-table-container">
      <ToastContainer />
      <h1 className="all-products-heading">All Products</h1>
      <div className="main-product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}  className="product-row">
              <td>
                {product.images && product.images.length > 0 && product.images[0].imageLinks.length > 0 ? (
                  <img 
                    src={product.images[0].imageLinks[0]} 
                    alt={product.title} 
                    className="product-table-image" 
                  />
                ) : (
                  <span>No Image Available</span>
                )}
              </td>
              <td>{product.title.slice(0, 10)}...</td>
              <td>Rs.{product.price}</td>
              <td>{product.description.slice(0, 20)}...</td>
              <td>
                <button className="edit-btn" onClick={() => handleUpdateProduct(product._id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {selectedProduct && (
        <div className="product-popup" onClick={handleClosePopup}>
          <div className="popup-content">
            <span className="close-btn" onClick={() => setSelectedProduct(null)}>&times;</span>
            <h2>{selectedProduct.title}</h2>
            {selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[0].imageLinks.length > 0 ? (
              <img 
                src={selectedProduct.images[0].imageLinks[0]} 
                alt={selectedProduct.title} 
                className="popup-image" 
              />
            ) : (
              <span>No Image Available</span>
            )}
            <p><strong>Price:</strong> Rs.{selectedProduct.price}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProduct;
