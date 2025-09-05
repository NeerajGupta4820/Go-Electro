import Coupon from "../Modals/couponModal.js";
import Product from "../Modals/productModal.js";

const createCoupon = async (req, res) => {
    try {
        const { code, discount, products } = req.body;

        const newCoupon = await Coupon.create({
            code,
            discount,
            products
        });

        await Product.updateMany(
            { _id: { $in: products } }, 
            { $push: { coupon: newCoupon._id } }
        );

        res.status(201).json({
            success: true,
            message: "Coupon created",
            data: newCoupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create coupon and update products",
            error: error.message
        });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discount, products } = req.body;
        
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        await Product.updateMany(
            { _id: { $in: coupon.products } },
            { $pull: { coupon: coupon._id } }
        );

        coupon.code = code;
        coupon.discount = discount;
        coupon.products = products;
        await coupon.save();

        await Product.updateMany(
            { _id: { $in: products } },
            { $push: { coupon: coupon._id } }
        );

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update coupon and update products",
            error: error.message
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        await Product.updateMany(
            { _id: { $in: coupon.products } },
            { $pull: { coupon: coupon._id } }
        );

        await Coupon.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete coupon and update products",
            error: error.message
        });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().populate('products'); 

        return res.status(200).json({ success: true, coupons });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


export { createCoupon, updateCoupon, deleteCoupon, getAllCoupons };
