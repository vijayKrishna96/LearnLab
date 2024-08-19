const Cart = require('../models/cartModel');


const getAllCart = async (req, res) => {
    try {
        const carts = await Cart.find(req.query).exec(); 
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching carts", error: error.message });
    }
};

// Get a single cart by ID
const getCartById = async (req, res) => {
    try {
        const cartById = await Cart.findById(req.params.cartId).exec();

        if (!cartById) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cartById);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add a new cart
const addItemtoCart = async (req, res) => {
    try {
        const cartData = req.body;
        const cart = new Cart(cartData); 

        const savedCart = await cart.save();
        res.status(201).json({ message: "Cart created successfully", savedCart });
    } catch (error) {
        res.status(500).json({ message: "Error adding cart", error: error.message });
    }
};

// Update an existing cart by ID
const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.cartId,
            req.body,
            { new: true } 
        ).exec();

        if (!updatedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ message: "Cart updated successfully", updatedCart });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error: error.message });
    }
};

// Delete a cart by ID
const deleteCart = async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.cartId).exec();
        if (!deletedCart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting cart", error: error.message });
    }
};

module.exports = {
    getAllCart,
    getCartById,
    addItemtoCart,
    updateCart,
    deleteCart
};
