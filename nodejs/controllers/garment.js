const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { GarmentRepository } = require('../repositories/garment.js');

const mapGarment = (garment) => ({
  id: garment._id.toString(),
  name: garment.name,
  type: garment.type,
  categoryId: garment.categoryId,
  color: garment.color,
  size: garment.size,
  image: garment.image,
});

const getAllGarments = async (req = request, res = response) => {
  try {
    const garments = await GarmentRepository.getAllByUser(req.userActive._id);
    res.status(200).json(garments.map(mapGarment));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener las prendas',
    });
  }
};

const getGarmentById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const garment = await GarmentRepository.getByIdAndUser(
      id,
      req.userActive._id,
    );

    if (!garment) {
      return res.status(404).json({
        msg: 'Prenda no encontrada',
      });
    }

    res.status(200).json(mapGarment(garment));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener la prenda',
    });
  }
};

const createGarment = async (req = request, res = response) => {
  const { name, type, categoryId, color, size, image } = req.body;

  if (!name || !type || !categoryId || !color || !size || !image) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    const savedGarment = await GarmentRepository.create({
      name: name.trim(),
      type: type.trim(),
      categoryId,
      color: color.trim(),
      size,
      image: image.trim(),
      user: req.userActive._id,
    });

    res.status(201).json(mapGarment(savedGarment));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear la prenda',
    });
  }
};

const updateGarmentById = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, type, categoryId, color, size, image } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  if (!name || !type || !categoryId || !color || !size || !image) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    const updatedGarment = await GarmentRepository.updateByIdAndUser(
      id,
      req.userActive._id,
      {
        name: name.trim(),
        type: type.trim(),
        categoryId,
        color: color.trim(),
        size,
        image: image.trim(),
      },
    );

    if (!updatedGarment) {
      return res.status(404).json({
        msg: 'Prenda no encontrada',
      });
    }

    res.status(200).json(mapGarment(updatedGarment));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar la prenda',
    });
  }
};

const deleteGarmentById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const result = await GarmentRepository.deleteByIdAndUser(
      id,
      req.userActive._id,
    );

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({
        msg: 'Prenda no encontrada',
      });
    }

    res.status(200).json({
      msg: 'Prenda eliminada exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar la prenda',
    });
  }
};

module.exports = {
  getAllGarments,
  getGarmentById,
  createGarment,
  updateGarmentById,
  deleteGarmentById,
};
