import { useNavigate } from "react-router-dom";
import AllCategories from "./AllCategories";
import { FaPlusCircle } from "react-icons/fa"; 
import "./AdminCategory.css";

const AdminCategory = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("create-category"); 
  };

  return (
    <div className="content-section">
        <h1 className="admin-category-heading">Category Management</h1>
      <div className="category-header">
        <button className="add-category-btn" onClick={handleAddProduct}>
        <FaPlusCircle />Add category
        </button>
      </div>
      <AllCategories />
    </div>
  );
};

export default AdminCategory;
