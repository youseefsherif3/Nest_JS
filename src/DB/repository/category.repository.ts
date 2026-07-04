//* Importing necessary modules and types
import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../models/category.model';

//* Category repository class extends the BaseRepository class to provide specific database operations for the Category model, allowing for easy extension and reuse in other repositories
@Injectable()
class CategoryRepository extends BaseRepository<Category> {
  constructor(
    @InjectModel(Category.name) protected CategoryModel: Model<Category>,
  ) {
    super(CategoryModel);
  }
}

//* Exporting the CategoryRepository class to be used in other parts of the application
export default CategoryRepository;
