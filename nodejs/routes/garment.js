const { Router } = require('express');
const {
  getAllGarments,
  getGarmentById,
  createGarment,
  updateGarmentById,
  deleteGarmentById,
} = require('../controllers/garment');
const { validateJWT } = require('../middlewares/verifyJWT');

const router = Router();

router.get('/', [validateJWT], getAllGarments);
router.get('/:id', [validateJWT], getGarmentById);
router.post('/', [validateJWT], createGarment);
router.put('/:id', [validateJWT], updateGarmentById);
router.delete('/:id', [validateJWT], deleteGarmentById);

module.exports = router;
