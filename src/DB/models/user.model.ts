//* Importing necessary decorators and functions from NestJS
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, RoleEnum } from 'src/common/enum/user.enum';
import { HashPassword } from 'src/common/utils/security/hashing.security';

//* User class defines the structure and schema for the User model in the database, including properties such as userName, email, password, age, phone , etc..
@Schema({
  timestamps: true,
  strictQuery: true,
  strict: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
    min: 3,
    max: 25,
  })
  userName: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({ type: Number, required: true, min: 20, max: 60 })
  age: number;

  @Prop({ type: String, trim: true })
  phone?: string;

  @Prop({ type: String, trim: true })
  address?: string;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.male })
  gender?: GenderEnum;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.user })
  role?: RoleEnum;

  @Prop({ type: String, trim: true })
  profileImage?: string;
}

//* UserSchema is created using the SchemaFactory to define the schema for the User model
export const UserSchema = SchemaFactory.createForClass(User);

//* UserDocument type is defined as a hydrated document of the User class
export type UserDocument = HydratedDocument<User>;

//* UserModel is defined as a Mongoose module for the User schema, with a pre-save hook to hash the password before saving it to the database
export const UserModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: () => {
      const schema = UserSchema;
      schema.pre('save', function () {
        if (this.isModified('password')) {
          this.password = HashPassword({ plainText: this.password });
        }
      });
      return schema;
    },
  },
]);
