//* Importing necessary modules from Mongoose and NestJS Mongoose
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { User } from 'src/common/decorators/user.decorator';

//* Category schema definition
@Schema({
  timestamps: true,
  strictQuery: true,
  strict: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

//* Category class definition
export class Category {
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
  image: string;

  @Prop([{ type: Types.ObjectId, ref: 'Brand' }])
  brand: Types.ObjectId[]

  @Prop({
    type: String,
    default: function (this: Category) {
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

//* Category schema factory creation
export const CategorySchema = SchemaFactory.createForClass(Category);

//* Pre-save hook to generate slug from name before saving the document
CategorySchema.pre(['findOneAndUpdate', 'updateOne'], function () {
  const update = this.getUpdate() as UpdateQuery<Category>;
  if (update.name) {
    update.slug = slugify(update.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
});

//* Category document type definition
export type CategoryDocument = HydratedDocument<Category>;

//* Category model definition
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
