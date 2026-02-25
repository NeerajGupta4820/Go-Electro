import express from 'express';
import {getAllOrders,getOrderById,addOrder,updateOrderStatus,deleteOrder,
    getOrdersByUser, verifyPayment,} from '../Controllers/orderController.js';

const orederRouter = express.Router();

orederRouter.get('/allorders', getAllOrders);
orederRouter.get('/:id', getOrderById);
orederRouter.post('/add', addOrder);
orederRouter.put('/update/:id', updateOrderStatus);
orederRouter.delete('/delete/:id', deleteOrder);
orederRouter.get('/user/:userId', getOrdersByUser);
orederRouter.post('/verify-payment', verifyPayment);

export default orederRouter;
