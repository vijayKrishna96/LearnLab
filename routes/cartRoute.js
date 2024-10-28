const express = require('express');
const { getAllCart, addItemtoCart, updateItemQuantity, removeItemFromCart, clearCart } = require('../controllers/cartController');



const router = express.Router();

router.get('/:userId', getAllCart)

router.post('/:userId/add', addItemtoCart)

router.put('/:userId/update', updateItemQuantity)

router.delete('/:userId/remove/:productId', removeItemFromCart);

router.delete('/:userId/clear', clearCart)

module.exports = router;
