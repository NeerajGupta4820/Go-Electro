import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import Footer from './Components/Footer/Footer';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/forgotpassword/ForgotPassword';
import Contact from './Pages/Contact/Contact';
import Cart from './Pages/Cart/Cart';
import UserProfile from './Pages/userProfile/userProfile';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProductDetail from './Pages/ProductDetailpage/ProductDetail';
import About from './Pages/About/About';
import './App.css';
import AllProducts from './Pages/AllProducts/AllProducts';
import Checkout from './Pages/checkout/Checkout';
import SearchResults from './Pages/SearchResults/SearchResults';
import StickyCategoriesBar from './Components/Navbar/StickyCategoriesBar';
import { useFetchAllCategoriesQuery } from './redux/api/categoryAPI';
import CompareStrip from './Components/CompareStrip/CompareStrip';
import CompareProducts from './Pages/CompareProducts/CompareProducts';
import GoElectroChatbot from './Components/GoElectroChatbot/GoElectroChatbot';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categoryData, isLoading: isCategoryLoading, isError: isCategoryError } = useFetchAllCategoriesQuery();
  const categories = categoryData?.data || [];
  const showStickyBar = location.pathname !== '/';
  const handleCategoryClick = (id) => {
    navigate('/allProducts', { state: { category: id } });
  };

  const ProtectedRoute = ({ children, role }) => {
    const { user } = useSelector((state) => state.user);
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user.role !== role) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <>
      <ScrollToTop />
      <Navbar />
      {showStickyBar && !isCategoryLoading && !isCategoryError && categories.length > 0 && (
        <StickyCategoriesBar
          categories={categories}
          onCategoryClick={handleCategoryClick}
          visible={true}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/about' element={<About/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path="/profile/*" element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>}/>
        <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}/>
        <Route path='/allProducts' element={<AllProducts/>}/>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/compare" element={<CompareProducts />} />
      </Routes>
  <Footer />
  <GoElectroChatbot />
    </>
  );
};

const App = () => {
  // Router is now in main.jsx, so just render AppContent
  return (
    <>
      <AppContent />
      <CompareStrip />
    </>
  );
};

export default App;
