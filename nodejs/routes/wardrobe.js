const { Router } = require('express');
const {
  getAllWardrobes,
  getWardrobeById,
  createWardrobe,
  updateWardrobeById,
  deleteWardrobeById,
} = require('../controllers/wardrobe');
const { validateJWT } = require('../middlewares/verifyJWT');

const router = Router();

router.get('/', [validateJWT], getAllWardrobes);
router.get('/:id', [validateJWT], getWardrobeById);
router.post('/', [validateJWT], createWardrobe);
router.put('/:id', [validateJWT], updateWardrobeById);
router.delete('/:id', [validateJWT], deleteWardrobeById);

module.exports = router;
