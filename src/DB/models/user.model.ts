import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, RoleEnum } from 'src/common/enum/user.enum';
import { HashPassword } from 'src/common/utils/security/hashing.security';

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

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
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
