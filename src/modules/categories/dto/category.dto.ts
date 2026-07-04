//* Importing necessary decorators from class-validator for validation purposes
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import { ValidateIds } from 'src/common/decorators/category.decorator';

//* Defining a Data Transfer Object (DTO) class for creating a category with validation rules
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;

  @Validate(ValidateIds)
  brands: Types.ObjectId[];

  
}

//* Defining a Data Transfer Object (DTO) class for updating a category with validation rules
export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;

  @Validate(ValidateIds)
  @IsOptional()
  brands: Types.ObjectId[];
}

//* Defining a Data Transfer Object (DTO) class for category ID validation
export class IdDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}

export class QueryCategoryDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
