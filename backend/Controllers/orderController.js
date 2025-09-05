import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../Modals/orderModel.js";
import User from "../Modals/userModal.js";
import Product from "../Modals/productModal.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const addOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {shippingInfo,subtotal,tax,shippingCharges,discount,total,orderItems,user,} = req.body;

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const razorpayOptions = {
      amount: Math.round(total * 100), // Amount in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      payment_capture: 1,
    };
    const razorpayOrder = await razorpay.orders.create(razorpayOptions);
    console.log("Razorpay order amount:", razorpayOrder.amount);
    const newOrder = new Order({
      shippingInfo,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
      user,
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });

    await newOrder.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      order: newOrder,
      razorpayOrderId: razorpayOrder.id,
      razorpayAmount: razorpayOrder.amount,
      razorpayCurrency: razorpayOrder.currency,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).populate("user", "name email");
    res.status(200).json({ success: true, orders: allOrders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update the status
    order.status = status || order.status;
    await order.save();

    res.status(200).json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = await Order.find({ user: userId }).populate("user", "name email");

    if (!userOrders.length) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    res.status(200).json({ success: true, orders: userOrders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user's orders",
      error: error.message,
    });
  }
};

// Payment Verification Controller
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const existignorder = await Order.findOne({ "paymentDetails.razorpayOrderId": razorpayOrderId });
    if (!existignorder) {
      return res.status(404).json({ success: false, message: "Order not found for this payment." });
    }
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }
    const order = await Order.findOne({ "paymentDetails.razorpayOrderId": razorpayOrderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment.",
      });
    }

    order.paymentDetails.paymentId = razorpayPaymentId;
    order.paymentDetails.status = "Paid";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order updated successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed due to server error.",
      error: error.message,
    });
  }
};


export {getAllOrders,getOrderById,addOrder,updateOrderStatus,deleteOrder,getOrdersByUser,verifyPayment};
