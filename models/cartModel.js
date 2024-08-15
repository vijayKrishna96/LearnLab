const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
    // cartId: { type: String, unique: true, required: true },
    user: { type: String , required: true },
    items: [cartItemSchema],
    product: {type: String, required: true},
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
