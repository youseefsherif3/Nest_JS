//* Importing necessary modules from NestJS and other files
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { TokenTypeEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import {
  CreateCategoryDto,
  IdDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { CategoryService } from './category.service';

//* CategoryController class to handle the category related requests
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //* The createCategory method handles the creation of a new category
  @Post('create')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.admin],
  })
  @UseInterceptors(FileInterceptor('attachment', multerCloud()))
  createCategory(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserDocument,
  ) {
    return this.categoryService.createCategory(body, file, user);
  }

    //* The updateCategory method handles the updating of an existing category
    @Patch('update/:id')
    @Auth({
      token_Type_Key: TokenTypeEnum.access_token,
      role_Type_Key: [RoleEnum.admin],
    })
    updateCategory(
      @Param() params: IdDto,
      @Body() body: UpdateCategoryDto,
      @User() user: UserDocument,
    ) {
      return this.categoryService.updateCategory(body, params.id, user);
    }

  //* The getAllCategories method retrieves all categories based on the provided query parameters
    @Get()
    getAllCategories(@Query() query: QueryCategoryDto) {
      return this.categoryService.getAllCategories(query);
    }

}
