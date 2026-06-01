const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { WardrobeRepository } = require('../repositories/wardrobe.js');
const { GarmentRepository } = require('../repositories/garment.js');

const mapWardrobe = (wardrobe) => ({
  id: wardrobe._id.toString(),
  name: wardrobe.name,
  location: wardrobe.location,
  description: wardrobe.description ?? '',
  garmentIds: wardrobe.garmentIds,
});

const validateGarmentIds = async (garmentIds, userId) => {
  if (!Array.isArray(garmentIds) || garmentIds.length === 0) {
    return 'Selecciona al menos una prenda';
  }

  const invalidId = garmentIds.find((id) => !ObjectId.isValid(id));

  if (invalidId) {
    return 'ID de prenda no válido';
  }

  const count = await GarmentRepository.countByIdsAndUser(garmentIds, userId);

  if (count !== garmentIds.length) {
    return 'Una o más prendas no pertenecen a tu inventario';
  }

  return null;
};

const getAllWardrobes = async (req = request, res = response) => {
  try {
    const wardrobes = await WardrobeRepository.getAllByUser(req.userActive._id);
    res.status(200).json(wardrobes.map(mapWardrobe));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener los armarios',
    });
  }
};

const getWardrobeById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const wardrobe = await WardrobeRepository.getByIdAndUser(
      id,
      req.userActive._id,
    );

    if (!wardrobe) {
      return res.status(404).json({
        msg: 'Armario no encontrado',
      });
    }

    res.status(200).json(mapWardrobe(wardrobe));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener el armario',
    });
  }
};

const createWardrobe = async (req = request, res = response) => {
  const { name, location, description, garmentIds } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    const garmentError = await validateGarmentIds(garmentIds, req.userActive._id);

    if (garmentError) {
      return res.status(400).json({
        msg: garmentError,
      });
    }

    const savedWardrobe = await WardrobeRepository.create({
      name: name.trim(),
      location,
      description: (description ?? '').trim(),
      garmentIds,
      user: req.userActive._id,
    });

    res.status(201).json(mapWardrobe(savedWardrobe));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear el armario',
    });
  }
};

const updateWardrobeById = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, location, description, garmentIds } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  if (!name || !location) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    const garmentError = await validateGarmentIds(garmentIds, req.userActive._id);

    if (garmentError) {
      return res.status(400).json({
        msg: garmentError,
      });
    }

    const updatedWardrobe = await WardrobeRepository.updateByIdAndUser(
      id,
      req.userActive._id,
      {
        name: name.trim(),
        location,
        description: (description ?? '').trim(),
        garmentIds,
      },
    );

    if (!updatedWardrobe) {
      return res.status(404).json({
        msg: 'Armario no encontrado',
      });
    }

    res.status(200).json(mapWardrobe(updatedWardrobe));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar el armario',
    });
  }
};

const deleteWardrobeById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const result = await WardrobeRepository.deleteByIdAndUser(
      id,
      req.userActive._id,
    );

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({
        msg: 'Armario no encontrado',
      });
    }

    res.status(200).json({
      msg: 'Armario eliminado exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar el armario',
    });
  }
};

module.exports = {
  getAllWardrobes,
  getWardrobeById,
  createWardrobe,
  updateWardrobeById,
  deleteWardrobeById,
};
