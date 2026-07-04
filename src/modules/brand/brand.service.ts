//* Importing necessary modules from NestJS and other files
import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateBrandDto,
  IdDto,
  QueryBrandDto,
  UpdateBrandDto,
} from './dto/brand.dto';
import { UserDocument } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repository/brand.repository';
import { S3Service } from 'src/common/service/s3.service';
import { Types } from 'mongoose';

//* BrandService class to handle the business logic related to brand operations
@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly S3Service: S3Service,
  ) {}

  //* The createBrand method handles the creation of a new brand
  async createBrand(
    body: CreateBrandDto,
    file: Express.Multer.File,
    user: UserDocument,
  ) {
    const { name } = body;

    const brandExists = await this.brandRepository.findOne({
      filter: { name },
    });

    if (brandExists) {
      throw new ConflictException('Brand already exists');
    }

    const logo = await this.S3Service.uploadFile({
      file,
      path: 'brand/logo',
    });

    const brand = await this.brandRepository.create({
      name,
      logo,
      createdBy: user._id,
    });

    if (!brand) {
      await this.S3Service.deleteFile(logo);
      throw new ConflictException('Brand creation failed');
    }

    return brand;
  }

  //* The updateBrand method handles the updating of an existing brand
  async updateBrand(
    body: UpdateBrandDto,
    id: Types.ObjectId,
    user: UserDocument,
  ) {
    const { name } = body;

    const brand = await this.brandRepository.findOne({
      filter: { _id: id },
    });

    if (!brand) {
      throw new ConflictException('Brand not found');
    }

    if (brand.name == name) {
      throw new ConflictException('Brand name is the same as the current name');
    }

    const updatedBrand = await this.brandRepository.findByIdAndUpdate({
      id,
      update: { name, updatedBy: user._id },
    });

    return {
      message: 'Brand updated successfully',
      data: { brand: updatedBrand },
    };
  }

  //* The getAllBrands method retrieves all brands based on the provided query parameters
  async getAllBrands(query: QueryBrandDto) {
    const { page, limit, search } = query;

    const brands = await this.brandRepository.paginate({
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

    return brands;
  }

  //* The getBrandById method retrieves a brand by its ID
  async getBrandById(id: Types.ObjectId) {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw new ConflictException('Brand not found');
    }

    return brand;
  }
}
