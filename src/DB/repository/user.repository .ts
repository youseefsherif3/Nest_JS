//* Importing necessary modules and types
import { Model } from 'mongoose';
import BaseRepository from './base.repository';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

//* UserRepository class extends the BaseRepository class to provide specific database operations for the User model, allowing for easy extension and reuse in other repositories
@Injectable()
class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) protected UserModel: Model<User>) {
    super(UserModel);
  }
}

//* Exporting the UserRepository class to be extended by specific repositories for different models
export default UserRepository;
