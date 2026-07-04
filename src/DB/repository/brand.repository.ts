//* Importing necessary modules and types
import { Injectable } from "@nestjs/common";
import BaseRepository from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand } from "../models/brand.model";

//* Brand repository class extends the BaseRepository class to provide specific database operations for the Brand model, allowing for easy extension and reuse in other repositories
@Injectable()
class BrandRepository extends BaseRepository<Brand> {
  constructor(@InjectModel(Brand.name) protected BrandModel: Model<Brand>) {
    super(BrandModel);
  }
}

//* Exporting the BrandRepository class to be used in other parts of the application
export default BrandRepository;