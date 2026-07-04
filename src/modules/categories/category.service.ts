//* Importing necessary modules from NestJS and other files
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { UserDocument } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repository/brand.repository';
import { S3Service } from 'src/common/service/s3.service';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repository/category.repository';

//* CategoryService class to handle the business logic related to category operations
@Injectable()
export class CategoryService {
  constructor(
    private readonly CategoryRepository: CategoryRepository,
    private readonly BrandRepository: BrandRepository,
    private readonly S3Service: S3Service,
  ) {}

  //* The createCategory method handles the creation of a new Category
  async createCategory(
    body: CreateCategoryDto,
    file: Express.Multer.File,
    user: UserDocument,
  ) {
    const { name, brands } = body;

    if (await this.CategoryRepository.findOne({ filter: { name } })) {
      throw new ConflictException('Category with this name already exists');
    }

    const strictIds = ([...new Set(brands || [])] as any).map((id) =>
      Types.ObjectId.createFromHexString(id),
    );

    if (
      brands &&
      (await this.BrandRepository.find({ filter: { _id: { $in: brands } } }))
        .length != strictIds.length
    ) {
      throw new NotFoundException('One or more brands not found');
    }

    const image = await this.S3Service.uploadFile({ file, path: 'category' });

    const category = await this.CategoryRepository.create({
      name,
      brand: strictIds,
      image,
      createdBy: user._id,
    });

    return category;
  }

  //* The updateCategory method handles the updating of an existing Category
  async updateCategory(
    body: UpdateCategoryDto,
    id: Types.ObjectId,
    user: UserDocument,
  ) {
    const { name, brands } = body;

    const category = await this.CategoryRepository.findOne({
      filter: { _id: id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.name == name) {
      throw new ConflictException(
        'Category name is the same as the current name',
      );
    }

    const strictIds = ([...new Set(brands || [])] as any).map((id) =>
      Types.ObjectId.createFromHexString(id),
    );

    if (
      brands &&
      (await this.BrandRepository.find({ filter: { _id: { $in: brands } } }))
        .length != strictIds.length
    ) {
      throw new NotFoundException('One or more brands not found');
    }

    const updatedCategory = await this.CategoryRepository.findOneAndUpdate({
      filter: { _id: id },
      update: { name, brands: strictIds, updatedBy: user._id },
      options: { new: true },
    });

    return updatedCategory;
  }

  //* The getAllCategories method retrieves all categories based on the provided query parameters
  async getAllCategories(query: QueryCategoryDto) {
    const { page, limit, search } = query;

    const categories = await this.CategoryRepository.paginate({
      page,
      limit,
      search: search
        ? {
            $or: [
              {
                name: { $regex: search, $options: 'i' },
              },
            ],
          }
        : {},
    });

    return categories;
  }

}
