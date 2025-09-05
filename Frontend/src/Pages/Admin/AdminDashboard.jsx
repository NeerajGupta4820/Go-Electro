import { Navigate, Route, Routes } from "react-router-dom";
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
  return (
    <>
      <header className="dashboard-main-header">
        <button id="hamburger">
          <HiMenuAlt4 />
        </button>
        <h2>Admin Dashboard</h2>
      </header>
      <div className="admin-dashboard">
        {/* Header section */}
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
