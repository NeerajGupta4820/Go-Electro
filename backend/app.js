import express from "express";
import userRouter from "./Routes/userRoutes.js";
import productRouter from "./Routes/productRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
import cors from "cors"
import cartRouter from "./Routes/cartRoutes.js";
import orederRouter from "./Routes/orderRotues.js";
import couponRoutes from "./Routes/couponRoutes.js";
import chartRoutes from "./Routes/chartRoutes.js";
const app = express();

app.use(cors());
  

app.use(express.json());

// Routes
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/category',categoryRoutes);
app.use('/api/review',reviewRoutes);
app.use('/api/cart',cartRouter);
app.use('/api/order',orederRouter);
app.use('/api/coupon',couponRoutes);
app.use('/api/chart',chartRoutes);

export default app;