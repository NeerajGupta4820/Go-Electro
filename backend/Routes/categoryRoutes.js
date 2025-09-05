import express from "express";
import { checkAdmin } from "../Utils/jwt.js";
import { createCategory, deleteCategory, fetchAllCategory, updateCategory } from "../Controllers/categoryController.js";
const categoryRoutes = express.Router();

categoryRoutes.get('/all',fetchAllCategory);
categoryRoutes.post('/update/:id',checkAdmin,updateCategory);
categoryRoutes.post('/delete/:id',checkAdmin,deleteCategory);
categoryRoutes.post('/create',checkAdmin,createCategory);

export default categoryRoutes;