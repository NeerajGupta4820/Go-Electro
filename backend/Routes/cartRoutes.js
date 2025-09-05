import express from "express";
import { checkLogin } from "../Utils/jwt.js";
import { addToCart, clearCart, getCart, updateCart } from "../Controllers/cartController.js";
const cartRouter = express.Router();

cartRouter.get('/get',checkLogin,getCart);
cartRouter.post('/update',checkLogin,updateCart);
cartRouter.post('/clear',checkLogin,clearCart);
cartRouter.post('/delete',checkLogin,addToCart);

export default cartRouter;