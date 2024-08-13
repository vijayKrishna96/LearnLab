
const Category = require("../models/categoryModel");

const getAllCategory = async(req, res) => {
    const category = await Category.find({});
    res.json(category)
}

const getCategoryById = async(req , res) =>{
    try{
        const category = await Category.findById(req.params.categoryId).exec();

        if(!category){
            return res.status(404).json({message: 'category Not Found'});
        }
        res.status(200).json(category);

    }catch{
        res.status(500).json({message : 'Server error',error : error.message});
    }
}

const addNewCategory = async(req , res) =>{
    const categoryData = req.body;
    const category = new Category(categoryData)
    await category.save();
    res.status(201).json(category)
}
const updateCategory = async(req ,res )=>{
    try{
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.categoryId,
            req.body,
            {new: true}
        );
        res.status(201).json(updatedCategory)
    }catch{
        res.status(404).send("category not updated")
    }
}
const deleteCategory = async(req, res) =>{
    try{
        const deleted = await Category.findByIdAndDelete(
            req.params.categoryId,
            req.body,
            {new: true}
        )
        res.status(201).json(deleted);
    }catch{
        res.status(404).json({message : 'Category Not Deleted'})
    }
}

module.exports = {
    getAllCategory,
    getCategoryById,
    addNewCategory,
    deleteCategory,
    updateCategory
}