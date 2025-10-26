import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import Loader from '../Loader/Loader';
import { FaBoxOpen, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addToCart } from '../../redux/slices/cartSlice'; // Assuming cart slice for adding to cart

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user.token]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .then(() => {
        toast.info('Removed from wishlist', {
          position: 'top-center',
          autoClose: 1200,
          hideProgressBar: true,
          theme: 'dark',
        });
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to remove', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
          theme: 'dark',
        });
      });
  };

  const handleView = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name || product.title} added to cart!`, {
      position: 'top-center',
      autoClose: 1200,
      hideProgressBar: true,
      theme: 'dark',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mb-8 justify-center">
        <FaHeart className="text-red-500" /> My Wishlist
      </h2>

      {products.length === 0 ? (
        <Card className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
          <CardContent className="flex flex-col items-center">
            <FaBoxOpen className="text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Looks like you haven’t added any favorites yet. Start exploring our collection!
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200"
              onClick={() => navigate('/allproducts')}
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((productOrId) => {
            const product = typeof productOrId === 'string' ? { _id: productOrId, title: 'Product', price: null, images: [], stock: true } : productOrId || {};
            const img = product.images?.[0]?.imageLinks?.[0] || product.image || '/placeholder.jpg';
            const isInStock = product.stock !== false; // Assuming stock is a boolean or undefined
            return (
              <Card
                key={product._id}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div
                    className="relative aspect-square cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    onClick={() => handleView(product._id)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={img}
                      alt={product.name || product.title || 'Product'}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 text-red-500 hover:text-red-600 hover:scale-110 transition-transform bg-white/80 rounded-full p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product._id);
                      }}
                      aria-label="Remove from wishlist"
                    >
                      <FaHeart size={22} className="fill-current" />
                    </Button>
                    {!isInStock && (
                      <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-600 text-white font-semibold">
                        Out of Stock
                      </Badge>
                    )}
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-500 text-white font-semibold">
                        {product.discount}% Off
                      </Badge>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent transform translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
                      <p className="text-white font-semibold text-sm truncate">
                        {product.name || product.title || 'Unnamed Product'}
                      </p>
                      <p className="text-orange-400 font-bold text-sm">
                        {product.price ? `Rs. ${product.price.toFixed(2)}` : 'Price not available'}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-800 font-semibold text-base truncate">
                        {product.name || product.title || 'Unnamed Product'}
                      </p>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-600 text-sm">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-orange-500 font-bold text-base">
                      {product.price ? `Rs. ${product.price.toFixed(2)}` : 'Price not available'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    onClick={() => handleView(product._id)}
                  >
                    View Product
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    onClick={() => handleAddToCart(product)}
                    disabled={!isInStock}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;