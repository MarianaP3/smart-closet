const { Router } = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/category');
const { validateJWT } = require('../middlewares/verifyJWT');
const { verifyAdminRole } = require('../middlewares/verifyAdminRole');

const router = Router();

router.get('/', [validateJWT], getAllCategories);
router.get('/:id', [validateJWT], getCategoryById);
router.post('/', [validateJWT, verifyAdminRole], createCategory);
router.put('/:id', [validateJWT, verifyAdminRole], updateCategoryById);
router.delete('/:id', [validateJWT, verifyAdminRole], deleteCategoryById);

module.exports = router;
