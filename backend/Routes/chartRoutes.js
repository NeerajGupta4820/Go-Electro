import express from "express";
import { checkAdmin } from "../Utils/jwt.js";
import { order, product, users } from "../Controllers/chartController.js";

const chartRoutes = express.Router();

chartRoutes.post('/product',checkAdmin,product);
chartRoutes.post('/order',checkAdmin,order);
chartRoutes.post('/users',checkAdmin,users);

export default chartRoutes;