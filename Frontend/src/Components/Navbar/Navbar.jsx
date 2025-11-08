import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { clearCart, setCartData } from "../../redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdateCartMutation } from "../../redux/api/cartAPI";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";
import { Menu, X, Search, ShoppingCart, Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const {
    cartItems = [],
    totalAmount,
    totalQuantity,
  } = useSelector((state) => state.cart.cart || {});
  const wishlistProducts = useSelector((state) => state.wishlist?.products || []);
  const [updateCart] = useUpdateCartMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize cart from localStorage (so counts show on refresh)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cartData");
      if (saved) {
        const parsed = JSON.parse(saved);
        // only set if store is empty to avoid overwriting server-synced carts
        if ((cartItems == null || cartItems.length === 0) && parsed) {
          dispatch(setCartData(parsed));
        }
      }
    } catch (err) {
      // ignore parse errors
    }

    // If user is logged in, fetch wishlist so heart count is available immediately
    if (user) {
      dispatch(fetchWishlist());
    }
    // we only want to run this on mount / when user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm("");
      setIsMobileMenuOpen(false);
    }
  };

  const logoutUser = async () => {
    try {
      await updateCart({ cartItems, totalQuantity, totalAmount }).unwrap();
      dispatch(clearCart());
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      navigate("/");
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      toast.error("Failed to update cart. Please try again.", error.message);
    }
  };

  const handleProfileRedirect = () => {
    if (user.role === "admin") navigate("/admin");
    else navigate("/profile");
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-background border-b transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-base lg:text-lg">GE</span>
            </div>
            <span className="hidden sm:block text-lg lg:text-xl font-bold text-foreground">
              GoElectro
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search products..."
                className="w-full pl-4 pr-12 h-10 bg-muted/50 border-border focus:bg-background transition-colors"
              />
              <Button
                onClick={handleSearch}
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 hover:text-yellow-400 hover:bg-yellow-400/10"
              onClick={() => navigate("/cart")}
            >
              <div className="relative">
                <ShoppingCart className="h-4.5 w-4.5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="font-medium text-sm">Cart</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 hover:text-red-500 hover:bg-red-500/10"
              onClick={() => navigate("/wishlist")}
            >
              <div className="relative">
                <Heart className="h-4.5 w-4.5" />
                {wishlistProducts.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                    {wishlistProducts.length}
                  </span>
                )}
              </div>
              <span className="font-medium text-sm">Wishlist</span>
            </Button>

            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="font-medium text-sm"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-sm"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 hover:text-yellow-400 hover:bg-yellow-400/10"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-4.5 w-4.5" />
                  <span className="font-medium text-sm">Account</span>
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-popover border border-border rounded-lg shadow-lg animate-scale-in overflow-hidden">
                    <div className="px-3 py-2 border-b border-border bg-muted/50">
                      <p className="text-sm font-medium text-foreground">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role || "Customer"}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={handleProfileRedirect}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/wishlist");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Heart className="h-3.5 w-3.5 text-red-500" />
                        <span>Wishlist</span>
                      </button>
                      <div className="border-t border-border my-1.5" />
                      <button
                        onClick={logoutUser}
                        className="w-full px-3 py-1.5 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:text-yellow-400"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:text-yellow-400"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search products..."
              className="w-full pl-4 pr-12 h-9 bg-muted/50 border-border focus:bg-background"
            />
            <Button
              onClick={handleSearch}
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-yellow-400"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden border-t border-border bg-background animate-slide-in-right"
        >
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col gap-1.5">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                Home
              </Link>
              <Link
                to="/allProducts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                All Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                Contact
              </Link>

              <div className="border-t border-border my-1.5" />

              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors font-medium flex items-center gap-2 text-sm"
              >
                <div className="relative">
                  <Heart className="h-4.5 w-4.5" />
                  {wishlistProducts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                      {wishlistProducts.length}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>

              {!user ? (
                <>
                  <Button
                    variant="outline"
                    className="mt-1.5 text-sm"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm"
                    onClick={() => {
                      navigate("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleProfileRedirect}
                    className="px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium flex items-center gap-2 text-left text-sm"
                  >
                    <LayoutDashboard className="h-4.5 w-4.5 text-primary" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={logoutUser}
                    className="px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors font-medium flex items-center gap-2 text-left text-sm"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;