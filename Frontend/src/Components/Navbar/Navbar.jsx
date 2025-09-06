import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdateCartMutation } from "../../redux/api/cartAPI";
import { FaTimes, FaRegUser } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import Pill from "../Pill/Pill";
import logo from "../../assets/Images/Logo/Logo.webp";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const {
    cartItems = [],
    totalAmount,
    totalQuantity,
  } = useSelector((state) => state.cart.cart || {});
  const [updateCart] = useUpdateCartMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [width, setWidth] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null); // Add ref for dropdown

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm("");
    }
  };

  const logoutUser = async () => {
    try {
      await updateCart({ cartItems, totalQuantity, totalAmount }).unwrap();
      dispatch(clearCart());
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update cart. Please try again.", error.message);
    }
  };

  const handleProfileRedirect = () => {
    if (user.role === "admin") navigate("/admin");
    else navigate("/profile");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) setWidth(true);
      else setWidth(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if click is outside of dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideMobileMenu = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMobileMenu);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
  }, []);

  return (
    <nav className="navbar pro-electro-navbar">
      <div className="navbar-container pro-electro-navbar-container">
        <div className="navbar-logo pro-electro-navbar-logo">
          <Link to="/">
            <img src={logo} alt="GoElectro" className="logo-image pro-electro-logo-image" />
          </Link>
        </div>

        <div className="navbar-search pro-electro-navbar-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search products..."
            className="search-input pro-electro-search-input"
            style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
          />
          <button onClick={handleSearch} className="search-button pro-electro-search-button">
            <FaSearch />
          </button>
        </div>

        <ul
          ref={mobileMenuRef}
          className={`navbar-links pro-electro-navbar-links ${isMobileMenuOpen ? "active" : ""}`}
        >
          {isMobileMenuOpen && (
            <>
              <li className="menu-icon pro-electro-menu-icon" onClick={toggleMobileMenu}>
                <FaTimes />
              </li>
              <li className="mobile-search-item pro-electro-mobile-search-item">
                <div className="mobile-search pro-electro-mobile-search">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search products..."
                    className="mobile-search-input pro-electro-mobile-search-input"
                    style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
                  />
                  <button onClick={handleSearch} className="mobile-search-button pro-electro-mobile-search-button">
                    <FaSearch />
                  </button>
                </div>
              </li>
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/">Home</Link>
              </li>
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/about">About</Link>
              </li>
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/contact">Contact</Link>
              </li>
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/allProducts">All Products</Link>
              </li>
            </>
          )}
          <li onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/cart">
              <FiShoppingCart />
            </Link>
            {cartItems.length !== 0 && <Pill label={cartItems.length} />}
          </li>

          {!user ? (
            <>
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/login">Login</Link>
              </li>
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          ) : (
            <li
              ref={dropdownRef}
              onClick={toggleDropdown}
              className="pro-electro-user-dropdown"
              style={{ position: "relative", cursor: "pointer", color: "#ffd700" }}
            >
              <FaRegUser style={{ color: "#ff4d4d", fontWeight: "600" }} />
              {dropdownOpen && (
                <ul
                  className="pro-electro-dropdown-menu"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    backgroundColor: "#232a3a",
                    color: "#ffd700",
                    listStyleType: "none",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 8px #ffd70022",
                    minWidth: "120px",
                    zIndex: 1000,
                  }}
                >
                  <li
                    onClick={() => {
                      handleProfileRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ cursor: "pointer", padding: "0.5rem", borderBottom: "1px solid #ffd70022" }}
                  >
                    Dashboard
                  </li>
                  <li
                    onClick={() => {
                      logoutUser();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ cursor: "pointer", padding: "0.5rem", color: "#ff4d4d" }}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>

        {width && (
          <div className="menu-icon pro-electro-menu-icon" onClick={toggleMobileMenu}>
            <FaBars />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
