import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import Stopwatch from "../../Components/admin/Apps/StopWatch";
// import CoinToss from "../../Components/admin/Apps/Toss";
import Categories from "../../Components/admin/category/Categories";
import Chart from "../../Components/admin/Charts/Chart";
import Coupon from "../../Components/admin/coupon/Coupon";
import Customer from "../../Components/admin/customers/Customers";
import Dashboard from "../../Components/admin/dashboard/Dashboard";
import Product from "../../Components/admin/product/Product";
import AdminSidebar from "../../Components/admin/sidebar/SideBar";
import Transaction from "../../Components/admin/transactions/Transactions";
import { HiMenuAlt4 } from "react-icons/hi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
    navigate('/login');
  };
  const handleGoHome = () => {
    navigate('/');
  };
  const handleExitDashboard = () => {
    navigate('/');
  };
  return (
    <>
      <header className="dashboard-main-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={handleGoHome} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', color: '#408de4' }} title="Go to Home">
            <FaHome />
          </button>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={handleExitDashboard} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.7rem', color: '#dc3545' }} title="Exit Dashboard">
            <HiMenuAlt4 />
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.7rem', color: '#dc3545' }} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </header>
      <div className="admin-dashboard">
        <AdminSidebar />
        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/*" element={<Product />} />
            <Route path="/categories/*" element={<Categories />} />
            <Route path="/coupons" element={<Coupon />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/charts" element={<Chart />} />
            <Route path="/app/stopwatch" element={<Stopwatch />} />
            {/* <Route path="/app/toss" element={<CoinToss />} /> */}
          </Routes>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
