const express = require("express")
const { getAllCategory, getCategoryById, addNewCategory, updateCategory, deleteCategory } = require("../controllers/categoryController")

const router = express.Router()


router.get("/",getAllCategory)

router.get('/:categoryId',getCategoryById)

router.post("/",addNewCategory)

router.patch('/:categoryId',updateCategory)

router.delete('/:categoryId',deleteCategory)

module.exports = router;