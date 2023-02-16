const express = require('express');
const categoryController = require('../controllers/categoryController');
const protect = require('./../middlewares/protect');

const router = express.Router();


router
	.route('/:parentId')
	.post(categoryController.setCatParentIds, categoryController.createCategory)

router
	.route('/')
	.post(categoryController.createCategory)
	.get(categoryController.getAllCategories);

router
	.route('/:id')
	.patch(categoryController.updateCategory)
	.delete(categoryController.beforeDelete, categoryController.deleteCategory)
	.get(categoryController.getOneCategory)


router.route('/rename/:refId').patch(protect, categoryController.renameCategory);
router.route('/:slug/:parentId').patch(categoryController.moveCategory);


router
	.route('/decendants/:categoryId')
	.get(categoryController.getDecendants)

module.exports = router;
