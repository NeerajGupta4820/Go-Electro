import Order from "../Modals/orderModel.js";
import Product from "../Modals/productModal.js"
import User from "../Modals/userModal.js";


// product category number
// product stock
const product = async(req,res)=>{
    try {
        const Products = await Product.find().select('name stock category');

        return res.status(200).json({success:true,Products});
    } catch (error) {
        return res.status(500).json({success:false,error});
    }
}

// order status: shipped, delicered, processing
const order = async(req,res)=>{
    try {
        const orders = await Order.find().select('status');

        return res.status(200).json({success:true,orders});
    } catch (error) {
        return res.status(500).json({success:false,error});
    }
}

// user, admin number 
// user count increase/ decrease in 6 months
// user age group
const users = async(req,res)=>{
    try {
        const users = await User.find().select('role age createdAt');

        return res.status(200).json({success:true,users});
    } catch (error) {
        return res.status(500).json({success:false,error});
    }
}

export {product,users,order};