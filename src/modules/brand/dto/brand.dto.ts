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
} from 'class-validator';
import { Types } from 'mongoose';

//* Defining a Data Transfer Object (DTO) class for creating a brand with validation rules
export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;
}

//* Defining a Data Transfer Object (DTO) class for updating a brand with validation rules
export class UpdateBrandDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  name: string;
}

//* Defining a Data Transfer Object (DTO) class for brand ID validation
export class IdDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}

export class QueryBrandDto {
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
