const express = require('express')
const { loginUser, verifyLogin, logout,  } = require('../controllers/authController')
const router = express.Router()

router.post('/login', loginUser)
router.get('/verify' , verifyLogin),
router.post('/logout', logout)

module.exports = router