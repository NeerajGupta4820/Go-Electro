import { useState, useEffect,useRef } from "react";
import { FaShoppingCart} from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useGetProductByIdQuery, useGetRelatedProductsQuery } from "../../redux/api/productAPI";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import "./ProductDetail.css";
import ProductSlider from "../../Components/ProductSlider/ProductSlider";
import ReviewSection from "../../Components/reveiwsection/ReviewSection";

const ProductDetail = () => {
  
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  console.log(data)
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [buttonColor, setButtonColor] = useState('#rgb(247, 139, 90)'); 
  const currentIndex = useRef(0); 

  const colors = ['#4dbdd6', '#28a745', '#ffc107', '#dc3545'];
  const product = data?.product;

  const { data: relatedData, isLoading: relatedLoading } = useGetRelatedProductsQuery(id);
  const relatedProducts = relatedData?.products;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedColor(product.images[0].color);
      setSelectedImage(product.images[0].imageLinks[0]);
    }
  }, [product]);

  if (isLoading || relatedLoading) return <Loader />;
  if (isError || !product) return <p>Product not found</p>;

  const imagesToDisplay = product.images.filter((image) => image.color === selectedColor);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleAddToCart = () => {
    currentIndex.current = (currentIndex.current + 1) % colors.length;
    setButtonColor(colors[currentIndex.current]);
    dispatch(addToCart({productId:product._id,price:product.price,quantity:1,name:product.title,images:product.images}));
    toast.success("Added",{
      position:"top-center",
      autoClose:1000,
      hideProgressBar:true,
      theme:"dark",
    })
    setIsAdded(true);
    
    setTimeout(() => {
      setButtonColor('#rgb(247, 139, 90)'); 
      setIsAdded(false);
    }, 1500); 
  };


  const shortDescription = product.description.split(" ").slice(0, 100).join(" ") + "...";

  return (
    <div className="product-detail-container">
      <div className="product-detail-main">
        <div className="product-detail-left">
          <div className="product-thumbnails">
            {imagesToDisplay.length > 0 &&
              imagesToDisplay[0].imageLinks.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className={`thumbnail-image ${imgUrl === selectedImage ? "active-thumbnail" : ""}`}
                  onClick={() => setSelectedImage(imgUrl)}
                />
              ))}
          </div>
          <div className="product-main-image">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected product"
                className="main-image"
              />
            )}
          </div>
        </div>

        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <h2>Price: <span> Rs.{product.price}</span></h2>
          <p>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
          {
          product.stock>0 ?
          <button 
          className={`add-to-cart ${isAdded ? 'added' : ''}`} 
          onClick={handleAddToCart}
          style={{ backgroundColor: buttonColor }} >
          <FaShoppingCart className={`cart-icon ${isAdded ? 'move' : ''}`} />
          {isAdded ? 'Added' : 'Add to Cart'}
          </button>:
          <button className="notcart-icon" disabled>
            <FaShoppingCart/>Add to Cart
          </button>
        }
          <p>Rating: {product.ratings}</p>
          <p>Category: {product.category?.name}</p>
          {
            product.images.length>1?
            <div className="color-options">
            <h3>Colors:</h3>
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`color-option ${selectedColor === image.color ? "active" : ""}`}
                onClick={() => {
                  setSelectedColor(image.color);
                  setSelectedImage(image.imageLinks[0]);
                }}
                style={{ backgroundColor: image.color }}
              />
            ))}
          </div>:
            ""
          }
          <div
  dangerouslySetInnerHTML={{
    __html: showFullDescription ? product.description : shortDescription,
  }}
></div>

          <button onClick={toggleDescription} className="toggle-description-btn">
            {showFullDescription ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
      <ProductSlider 
        products={relatedProducts} 
        title="Related Products" 
        isLoading={false}  
      />
      <ReviewSection productId={id} />
    </div>
  );
};

export default ProductDetail;
