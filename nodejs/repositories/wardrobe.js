const Wardrobe = require('../models/wardrobe.js');
const ObjectId = require('mongoose').Types.ObjectId;

class WardrobeRepository {
  static async getAllByUser(userId) {
    return await Wardrobe.find({ user: userId });
  }

  static async getByIdAndUser(id, userId) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Wardrobe.findOne({ _id: id, user: userId });
  }

  static async create(wardrobeData) {
    const wardrobe = new Wardrobe(wardrobeData);
    return await wardrobe.save();
  }

  static async updateByIdAndUser(id, userId, updateData) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Wardrobe.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true },
    );
  }

  static async deleteByIdAndUser(id, userId) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Wardrobe.deleteOne({ _id: id, user: userId });
  }
}

module.exports = { WardrobeRepository };
