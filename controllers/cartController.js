const Cart = require('../models/cartModel');


const getAllCart = async (req, res) => {
    const userId = req.params.userId;
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart", error });
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
    const userId = req.params.userId;
    const { productId, title, price } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      // Create cart if it doesn't exist
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      // Check if item already exists in the cart
      const existingItem = cart.items.find((item) => item.productId.equals(productId));
  
      if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += 1;
      } else {
        // Add new item
        cart.items.push({ productId, title, price, quantity: 1 });
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart", error });
    }
  };

// Update an existing cart by ID
const updateItemQuantity = async (req, res) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const item = cart.items.find((item) => item.productId.equals(productId));
      if (item) {
        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating item quantity", error });
    }
  };

// Delete a cart by ID
const removeItemFromCart = async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      cart.items = cart.items.filter((item) => !item.productId.equals(productId));
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error removing item from cart", error });
    }
  };

  const clearCart = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      cart.items = [];
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart", error });
    }
  };
  
module.exports = {
    getAllCart,
    getCartById,
    addItemtoCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};
