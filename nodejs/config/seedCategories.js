const INITIAL_CATEGORIES = [
  {
    legacyId: '1',
    name: 'Tops',
    description: 'Blusas, camisetas y tops',
  },
  {
    legacyId: '2',
    name: 'Bottoms',
    description: 'Pantalones, faldas y shorts',
  },
  {
    legacyId: '3',
    name: 'Shoes',
    description: 'Calzado de todo tipo',
  },
  {
    legacyId: '4',
    name: 'Accessories',
    description: 'Bolsos, joyería y complementos',
  },
];

const seedCategories = async () => {
  const Category = require('../models/category.js');

  try {
    const count = await Category.countDocuments();

    if (count === 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
      console.log('Categorías iniciales cargadas en la base de datos');
    }
  } catch (error) {
    console.error('Error al cargar categorías iniciales:', error);
  }
};

module.exports = { seedCategories };
