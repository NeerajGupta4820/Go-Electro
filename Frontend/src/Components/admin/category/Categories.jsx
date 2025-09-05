import { Routes, Route } from "react-router-dom";
import AdminCategory from "./AdminCategory"; 
import CreateCategory from "./CreateCategory"; 
import UpdateCategory from "./UpdateCategory";

const Category = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminCategory />} /> 
      <Route path="create-category" element={<CreateCategory />} /> 
      <Route path="edit-category/:id" element={<UpdateCategory />} /> 
    </Routes>
  );
};

export default Category;
