import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [
        {
            color: {
                type: String,
                required: true,
            },
            imageLinks: [
                {
                    type: String, 
                    required: true,
                },
            ],
        },
    ],
    coupon: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
        }
    ],
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    brand: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
