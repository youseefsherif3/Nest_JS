//* Importing necessary modules from Mongoose and NestJS Mongoose
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { User } from 'src/common/decorators/user.decorator';

//* Brand schema definition
@Schema({
  timestamps: true,
  strictQuery: true,
  strict: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

//* Brand class definition
export class Brand {
  @Prop({
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 25,
    unique: true,
  })
  name: string;

  @Prop({ type: String, trim: true })
  logo: string;

  @Prop({
    type: String,
    default: function (this: Brand) {
      return slugify(this.name, { replacement: '-', lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;
}

//* Brand schema factory creation
export const BrandSchema = SchemaFactory.createForClass(Brand);

//* Pre-save hook to generate slug from name before saving the document
BrandSchema.pre(['findOneAndUpdate', 'updateOne'], function () {
  const update = this.getUpdate() as UpdateQuery<Brand>;
  if (update.name) {
    update.slug = slugify(update.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
});

//* Brand document type definition
export type BrandDocument = HydratedDocument<Brand>;

//* Brand model definition
export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);
