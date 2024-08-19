const express = require('express');
const { getAllCart, updateCart,  deleteCart, addItemtoCart } = require('../controllers/cartController');



const router = express.Router();

router.get('/', getAllCart)

router.post('/', addItemtoCart)

router.put('/:cartId', updateCart)

router.delete('/:cartId', deleteCart)

module.exports = router;
