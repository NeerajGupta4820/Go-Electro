import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../../redux/slices/userSlice";
import { clearCart } from "../../../redux/slices/cartSlice";
import { useUpdateCartMutation } from "../../../redux/api/cartAPI";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Users,
  FileText,
  BarChart2,
  Clock,
  Ticket,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user || { name: "Admin", role: "admin" });
  const { cartItems = [], totalAmount, totalQuantity } = useSelector((state) => state.cart.cart || {});
  const [updateCart] = useUpdateCartMutation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneActive, setPhoneActive] = useState(window.innerWidth < 900);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const resizeHandler = () => setPhoneActive(window.innerWidth < 900);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const logoutUser = async () => {
    try {
      await updateCart({ cartItems, totalQuantity, totalAmount }).unwrap();
      dispatch(clearCart());
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      closeSidebar();
    } catch (error) {
      toast.error("Failed to logout. Please try again.", error.message);
    }
  };

  return (
    <>
      {phoneActive && (
        <Button
          id="hamburger"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-[4.5rem] left-4 z-50 bg-background text-foreground hover:bg-yellow-400/10 hover:text-yellow-400"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <aside
        ref={sidebarRef}
        className={`fixed top-14 lg:top-16 left-0 z-40 w-48 bg-background border-r border-border shadow-sm h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Content */}
          <DivOne location={location} closeSidebar={closeSidebar} />
          <DivTwo location={location} closeSidebar={closeSidebar} />
          <DivThree location={location} closeSidebar={closeSidebar} />

          {/* User Info and Logout */}
          <div className="mt-auto p-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {user.name ? user.name[0].toUpperCase() : "A"}
              </div>
              <span className="text-sm font-medium text-foreground truncate">
                {user.name || "Admin"}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={logoutUser}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {phoneActive && isOpen && (
            <Button
              id="close-sidebar"
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="w-full text-foreground hover:bg-red-500/10 hover:text-red-500"
            >
              Close
            </Button>
          )}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
      </aside>
    </>
  );
};

const DivOne = ({ location, closeSidebar }) => (
  <div className="p-4">
    <h5 className="text-sm font-semibold text-muted-foreground mb-2">Dashboard</h5>
    <ul className="space-y-1">
      <Li
        url="/admin/dashboard"
        text="Dashboard"
        Icon={LayoutDashboard}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/product"
        text="Product"
        Icon={ShoppingBag}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/categories"
        text="Category"
        Icon={Layers}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/users"
        text="users"
        Icon={Users}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/transaction"
        text="Transaction"
        Icon={FileText}
        location={location}
        closeSidebar={closeSidebar}
      />
    </ul>
  </div>
);

const DivTwo = ({ location, closeSidebar }) => (
  <div className="p-4">
    <h5 className="text-sm font-semibold text-muted-foreground mb-2">Charts</h5>
    <ul className="space-y-1">
      <Li
        url="/admin/charts"
        text="Analytics"
        Icon={BarChart2}
        location={location}
        closeSidebar={closeSidebar}
      />
    </ul>
  </div>
);

const DivThree = ({ location, closeSidebar }) => (
  <div className="p-4">
    <h5 className="text-sm font-semibold text-muted-foreground mb-2">Apps</h5>
    <ul className="space-y-1">
      <Li
        url="/admin/app/stopwatch"
        text="Stopwatch"
        Icon={Clock}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/coupons"
        text="Coupons"
        Icon={Ticket}
        location={location}
        closeSidebar={closeSidebar}
      />
    </ul>
  </div>
);

const Li = ({ url, text, location, Icon, closeSidebar }) => {
  const isActive = location.pathname.startsWith(url);
  return (
    <li>
      <Link
        to={url}
        onClick={closeSidebar}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-foreground hover:bg-yellow-400/10 hover:text-yellow-400"
        }`}
      >
        <Icon className="h-4 w-4" />
        {text}
      </Link>
    </li>
  );
};

export default AdminSidebar;