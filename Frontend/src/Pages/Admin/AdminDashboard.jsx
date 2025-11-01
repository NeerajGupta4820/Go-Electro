import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import Stopwatch from "../../Components/admin/Apps/StopWatch";
import Categories from "../../Components/admin/category/Categories";
import Chart from "../../Components/admin/Charts/Chart";
import Coupon from "../../Components/admin/coupon/Coupon";
import Customer from "../../Components/admin/customers/Customers";
import Transactions from "../../Components/admin/transactions/Transactions";
import Dashboard from "../../Components/admin/dashboard/Dashboard";
import Product from "../../Components/admin/product/Product";
import AdminSidebar from "../../Components/admin/sidebar/SideBar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: "user/logout" });
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleExitDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoHome}
            className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
            title="Go to Home"
          >
            <FaHome className="text-2xl" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExitDashboard}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
            title="Exit Dashboard"
          >
            <HiMenuAlt4 className="text-xl" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
            title="Logout"
          >
            <FaSignOutAlt className="text-xl" />
          </button>
        </div>
      </header>

      {/* Main layout: Sidebar + Content */}
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-48">
          <AdminSidebar className="fixed top-16 left-0 w-48 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-md overflow-y-auto" />
        </div>
        {/* Mobile Sidebar (handled by AdminSidebar's internal logic) */}
        <div className="lg:hidden">
          <AdminSidebar className="w-48 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 shadow-md overflow-y-auto" />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <main className="flex-1 min-w-0 p-6 bg-gray-50 h-[calc(100vh-4rem)] overflow-y-auto rounded-lg shadow-md">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product/*" element={<Product />} />
              <Route path="/categories/*" element={<Categories />} />
              <Route path="/coupons" element={<Coupon />} />
              <Route path="/transaction" element={<Transactions />} />
              <Route path="/users" element={<Customer />} />
              <Route path="/charts" element={<Chart />} />
              <Route path="/app/stopwatch" element={<Stopwatch />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;