const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", 
      required: true,
    },
    title: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  });
  
  const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
