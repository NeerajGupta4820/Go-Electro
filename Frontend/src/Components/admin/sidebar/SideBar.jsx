import { useEffect, useState,useRef } from "react";
import { AiFillFileText } from "react-icons/ai";
import {
FaChartBar,
// FaGamepad,
FaStopwatch,
} from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import {
  RiApps2AddFill,
  RiCoupon3Fill,
  RiShoppingBag3Fill,
  RiDashboardFill,
} from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneActive, setPhoneActive] = useState(window.innerWidth < 900);
  const sidebarRef=useRef(false);

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
  
  return (
    <>
      {phoneActive && (
        <button id="hamburger" onClick={toggleSidebar}>
          <HiMenuAlt4 />
        </button>
      )}
      <aside ref={sidebarRef} className={`sidebar ${isOpen ? "collapsed" : ""}`}>
        <DivOne location={location} closeSidebar={closeSidebar} />
        <DivTwo location={location} closeSidebar={closeSidebar} />
        <DivThree location={location} closeSidebar={closeSidebar} />
        {phoneActive && isOpen && (
          <button id="close-sidebar" onClick={closeSidebar}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

const DivOne = ({ location, closeSidebar }) => (
  <div>
    <h5>Dashboard</h5>
    <ul>
      <Li
        url="/admin/dashboard"
        text="Dashboard"
        Icon={RiDashboardFill}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/product"
        text="Product"
        Icon={RiShoppingBag3Fill}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/categories"
        text="Category"
        Icon={RiApps2AddFill}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/customer"
        text="Customer"
        Icon={IoIosPeople}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/transaction"
        text="Transaction"
        Icon={AiFillFileText}
        location={location}
        closeSidebar={closeSidebar}
      />
    </ul>
  </div>
);

const DivTwo = ({ location, closeSidebar }) => (
  <div>
    <h5>Charts</h5>
    <ul>
      <Li
        url="/admin/charts"
        text="All Charts"
        Icon={FaChartBar}
        location={location}
        closeSidebar={closeSidebar}
      />
    </ul>
  </div>
);

const DivThree = ({ location, closeSidebar }) => (
  <div>
    <h5>Apps</h5>
    <ul>
      <Li
        url="/admin/app/stopwatch"
        text="Stopwatch"
        Icon={FaStopwatch}
        location={location}
        closeSidebar={closeSidebar}
      />
      <Li
        url="/admin/coupons"
        text="Coupons"
        Icon={RiCoupon3Fill}
        location={location}
        closeSidebar={closeSidebar}
      />
      {/* <Li
        url="/admin/app/toss"
        text="Toss"
        Icon={FaGamepad}
        location={location}
        closeSidebar={closeSidebar}
      /> */}
    </ul>
  </div>
);

const Li = ({ url, text, location, Icon, closeSidebar }) => {
  const isActive = location.pathname.startsWith(url);
  return (
    <li className={isActive ? "active" : ""} onClick={closeSidebar}>
      <Link to={url}>
        <Icon />
        {text}
      </Link>
    </li>
  );
};

export default AdminSidebar;
