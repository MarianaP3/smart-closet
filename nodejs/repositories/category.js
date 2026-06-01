const Category = require('../models/category.js');
const ObjectId = require('mongoose').Types.ObjectId;

class CategoryRepository {
  static async getAll() {
    return await Category.find().sort({ legacyId: 1, name: 1 });
  }

  static async getByPublicId(id) {
    if (ObjectId.isValid(id)) {
      const byObjectId = await Category.findById(id);
      if (byObjectId) {
        return byObjectId;
      }
    }

    return await Category.findOne({ legacyId: id });
  }

  static async getByName(name, excludeId = null) {
    const query = excludeId ? { _id: { $ne: null } } : {};
    let excludeObjectId = null;

    if (excludeId) {
      const current = await this.getByPublicId(excludeId);
      excludeObjectId = current?._id ?? null;
    }

    const categories = await Category.find(
      excludeObjectId ? { _id: { $ne: excludeObjectId } } : {},
    );

    return (
      categories.find(
        (category) =>
          category.name.toLowerCase() === name.trim().toLowerCase(),
      ) ?? null
    );
  }

  static async create(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  static async updateByPublicId(id, updateData) {
    const category = await this.getByPublicId(id);

    if (!category) {
      return null;
    }

    return await Category.findByIdAndUpdate(category._id, updateData, {
      new: true,
    });
  }

  static async deleteByPublicId(id) {
    const category = await this.getByPublicId(id);

    if (!category) {
      return null;
    }

    return await Category.deleteOne({ _id: category._id });
  }
}

module.exports = { CategoryRepository };
