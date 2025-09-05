import { Routes, Route } from "react-router-dom";
import AdminProduct from "./AdminProduct"; 
import CreateProduct from "./CreateProduct"; 
import UpdateProduct from "./UpdateProduct";

const Product = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminProduct />} /> 
      <Route path="createproduct" element={<CreateProduct />} /> 
      <Route path="update/:id" element={<UpdateProduct />} /> 
    </Routes>
  );
};

export default Product;
