import { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaShareAlt,
  FaFacebook,
  FaWhatsapp,
  FaLink,
  FaInstagram,
  FaHeart,
  FaRegHeart,
  FaTelegram,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useParams } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToCompare, removeFromCompare } from "../../redux/slices/compareSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
} from "../../redux/api/productAPI";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import ProductSlider from "../../Components/ProductSlider/ProductSlider";
import ReviewSection from "../../Components/reveiwsection/ReviewSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [buttonColor, setButtonColor] = useState("#408de4");
  const currentIndex = useRef(0);

  const colors = ["#4dbdd6", "#28a745", "#ffc107", "#dc3545"];
  const product = data?.product;

  const { data: relatedData, isLoading: relatedLoading } = useGetRelatedProductsQuery(id);
  const relatedProducts = relatedData?.products;

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const shareProduct = (platform) => {
    const productUrl = window.location.href;
    const shareText = `Check out ${product.title} on our store!`;
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`;
        break;
      case "gmail":
        shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(product.title)}&body=${encodeURIComponent(shareText + " " + productUrl)}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(productUrl)
          .then(() => {
            toast.success("Link copied to clipboard!");
            setShowShareModal(false);
          })
          .catch(() => {
            toast.error("Failed to copy link");
          });
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    setShowShareModal(false);
  };

  const compareProducts = useSelector((state) => state.compare.products);
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  const [compareBtnState, setCompareBtnState] = useState("add");
  useEffect(() => {
    if (product && compareProducts.some((p) => p._id === product._id)) {
      setCompareBtnState("remove");
    } else {
      setCompareBtnState("add");
    }
  }, [product, compareProducts]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedColor(product.images[0].color);
      setSelectedImage(product.images[0].imageLinks[0]);
    }
  }, [product]);

  const isWishlisted =
    Array.isArray(wishlistProducts) &&
    wishlistProducts.some((p) => {
      if (!p) return false;
      if (typeof p === "string") return p === product?._id;
      return (
        p._id === product?._id ||
        p.id === product?._id ||
        p.productId === product?._id
      );
    });

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => {
          toast.info("Removed from wishlist", {
            position: "top-center",
            autoClose: 1200,
            hideProgressBar: true,
            theme: "dark",
          });
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to remove from wishlist", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            theme: "dark",
          });
        });
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => {
          toast.success("Added to wishlist", {
            position: "top-center",
            autoClose: 1200,
            hideProgressBar: true,
            theme: "dark",
          });
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to add to wishlist", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            theme: "dark",
          });
        });
    }
  };

  const handleAddToCart = () => {
    currentIndex.current = (currentIndex.current + 1) % colors.length;
    setButtonColor(colors[currentIndex.current]);
    dispatch(
      addToCart({
        productId: product._id,
        price: product.price,
        quantity: 1,
        name: product.title,
        images: product.images,
      })
    );
    toast.success("Added", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      theme: "dark",
    });
    setIsAdded(true);
    setTimeout(() => {
      setButtonColor("#408de4");
      setIsAdded(false);
    }, 1500);
  };

  const handleCompareClick = () => {
    if (isCompared) {
      dispatch(removeFromCompare(product._id));
      setCompareBtnState("add");
    } else {
      dispatch(addToCompare(product));
      setCompareBtnState("remove");
    }
  };

  if (isLoading || relatedLoading) return <Loader />;
  if (isError || !product) return <p className="text-center text-red-600">Product not found</p>;

  const imagesToDisplay = product.images.filter((image) => image.color === selectedColor);
  const isCompared = compareProducts.some((p) => p._id === product._id);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-85vw mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="flex flex-row gap-8 p-6 border-none shadow-lg max-md:flex-col">
          <div className="relative flex w-1/2 max-md:w-full max-md:flex-col-reverse">
            <div className="flex flex-col gap-3 mr-6 max-md:flex-row max-md:justify-center max-md:gap-2 max-md:mt-4">
              {imagesToDisplay.length > 0 &&
                imagesToDisplay[0].imageLinks.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover border rounded-md cursor-pointer hover:border-blue-500 transition-colors ${
                      imgUrl === selectedImage ? "border-2 border-blue-600" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(imgUrl)}
                  />
                ))}
            </div>
            <div className="relative min-h-[34rem] min-w-[32rem] flex justify-center items-center border rounded-lg bg-white max-md:min-w-[20rem] max-md:w-full">
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`px-4 py-2 rounded-tl-[15px] rounded-br-[15px] font-semibold text-white text-sm ${
                    product.stock > 0 ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected product"
                  className="max-h-[30rem] max-w-[36rem] p-4 rounded-lg shadow-md max-md:max-w-[20rem]"
                />
              )}
            </div>
          </div>
          <CardContent className="w-1/2 max-md:w-full p-0 max-h-[600px] overflow-y-auto scrollbar-none relative">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button
                onClick={handleShareClick}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <FaShareAlt className="mr-2" /> Share
              </Button>
              <Button
                onClick={handleCompareClick}
                variant="outline"
                className={`border-blue-600 text-blue-600 hover:bg-blue-50 ${
                  isCompared ? "border-red-600 text-red-600 hover:bg-red-50" : ""
                }`}
              >
                {isCompared ? "Remove from Compare" : "Compare"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="text-red-500 hover:bg-red-50"
              >
{isWishlisted ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </Button>
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl text-gray-800">{product.title}</CardTitle>
            </CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-600 font-medium">Price:</span>
              <span className="text-red-600 text-xl font-semibold">Rs.{product.price}</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              {[...Array(5)].map((_, i) => {
                const rating = Number(product.ratings) || 0;
                return (
                  <span key={i} className="inline-block w-5 h-5">
                    {rating >= i + 1 ? (
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="#ffc107"
                        stroke="#ffc107"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ) : rating > i ? (
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffc107"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <defs>
                          <linearGradient id={`starGrad${i}`} x1="0" y1="0" x2="100%" y2="0">
                            <stop offset={`${Math.round((rating - i) * 100)}%`} stopColor="#ffc107" />
                            <stop offset={`${Math.round((rating - i) * 100)}%`} stopColor="#fff" />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                          fill={`url(#starGrad${i})`}
                        />
                      </svg>
                    ) : (
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="#fff"
                        stroke="#ffc107"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </span>
                );
              })}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mb-6">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === image.color ? "border-blue-600" : "border-gray-200"
                    } hover:border-blue-500 transition-colors`}
                    onClick={() => {
                      setSelectedColor(image.color);
                      setSelectedImage(image.imageLinks[0]);
                    }}
                    style={{ backgroundColor: image.color }}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex items-center gap-2 px-5 py-6 ${
                  isAdded ? "bg-green-600 hover:bg-green-700" : "bg-[#408de4] hover:bg-[#e07b50]"
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                <FaShoppingCart className={`transition-transform ${isAdded ? "translate-x-1" : ""}`} />
                {isAdded ? "Added" : "Add to Cart"}
              </Button>
            </div>
            <p className="text-gray-600 mb-6">
              {showFullDescription
                ? product.description
                : product.description.split(" ").slice(0, 50).join(" ") + "..."}
            </p>
            <Button
              onClick={toggleDescription}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </Button>
          </CardContent>
        </Card>
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="sm:max-w-[450px] bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-800">Share this product</DialogTitle>
              <DialogClose asChild>
              </DialogClose>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                />
              )}
              <p className="text-base text-gray-600 font-medium text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {product.title}
              </p>
              <div className="flex w-full gap-2">
                <Input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 border-gray-300 bg-gray-100 text-gray-800 text-sm"
                />
                <Button
                  onClick={() => shareProduct("copy")}
                  className="bg-blue-600 hover:bg-blue-800 flex items-center gap-1"
                >
                  <FaLink /> Copy
                </Button>
              </div>
              <div className="grid grid-cols-5 gap-2 w-full">
                <Button
                  onClick={() => shareProduct("facebook")}
                  className="bg-[#3b5998] hover:bg-[#3b5998]/90 text-2xl p-3"
                  aria-label="Share on Facebook"
                >
                  <FaFacebook />
                </Button>
                <Button
                  onClick={() => shareProduct("whatsapp")}
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-2xl p-3"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp />
                </Button>
                <Button
                  onClick={() => shareProduct("gmail")}
                  className="bg-[#EA4335] hover:bg-[#EA4335]/90 text-2xl p-3"
                  aria-label="Share via Gmail"
                >
                  <SiGmail />
                </Button>
                <Button
                  onClick={() => shareProduct("telegram")}
                  className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-2xl p-3"
                  aria-label="Share on Telegram"
                >
                  <FaTelegram />
                </Button>
                <Button
                  onClick={() => shareProduct("instagram")}
                  className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-2xl p-3"
                  aria-label="Share on Instagram"
                >
                  <FaInstagram />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-10">
        <ProductSlider products={relatedProducts} title="Related Products" isLoading={false} />
      </div>
      <ReviewSection productId={id} />
    </div>
  );
};

export default ProductDetail;