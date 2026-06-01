const { response, request } = require('express');
const { CategoryRepository } = require('../repositories/category.js');
const { GarmentRepository } = require('../repositories/garment.js');

const mapCategory = (category) => ({
  id: category.legacyId || category._id.toString(),
  name: category.name,
  description: category.description ?? '',
});

const getPublicCategoryId = (category) =>
  category.legacyId || category._id.toString();

const getAllCategories = async (req = request, res = response) => {
  try {
    const categories = await CategoryRepository.getAll();
    res.status(200).json(categories.map(mapCategory));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener las categorías',
    });
  }
};

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await CategoryRepository.getByPublicId(id);

    if (!category) {
      return res.status(404).json({
        msg: 'Categoría no encontrada',
      });
    }

    res.status(200).json(mapCategory(category));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener la categoría',
    });
  }
};

const createCategory = async (req = request, res = response) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      msg: 'Escribe un nombre para la categoría',
    });
  }

  try {
    const duplicate = await CategoryRepository.getByName(name);

    if (duplicate) {
      return res.status(400).json({
        msg: 'Ya existe una categoría con ese nombre',
      });
    }

    const savedCategory = await CategoryRepository.create({
      name: name.trim(),
      description: (description ?? '').trim(),
    });

    res.status(201).json(mapCategory(savedCategory));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear la categoría',
    });
  }
};

const updateCategoryById = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      msg: 'Escribe un nombre para la categoría',
    });
  }

  try {
    const current = await CategoryRepository.getByPublicId(id);

    if (!current) {
      return res.status(404).json({
        msg: 'Categoría no encontrada',
      });
    }

    const duplicate = await CategoryRepository.getByName(name, id);

    if (duplicate) {
      return res.status(400).json({
        msg: 'Ya existe otra categoría con ese nombre',
      });
    }

    const categoryId = getPublicCategoryId(current);
    const trimmedName = name.trim();

    const updatedCategory = await CategoryRepository.updateByPublicId(id, {
      name: trimmedName,
      description: (description ?? '').trim(),
    });

    if (current.name !== trimmedName) {
      await GarmentRepository.syncTypeByCategoryId(categoryId, trimmedName);
    }

    res.status(200).json(mapCategory(updatedCategory));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar la categoría',
    });
  }
};

const deleteCategoryById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await CategoryRepository.getByPublicId(id);

    if (!category) {
      return res.status(404).json({
        msg: 'Categoría no encontrada',
      });
    }

    const categoryId = getPublicCategoryId(category);
    const garmentCount = await GarmentRepository.countByCategoryId(categoryId);

    if (garmentCount > 0) {
      return res.status(400).json({
        msg: 'No puedes eliminar una categoría que tiene prendas asignadas',
      });
    }

    await CategoryRepository.deleteByPublicId(id);

    res.status(200).json({
      msg: 'Categoría eliminada exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar la categoría',
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
