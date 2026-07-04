//* Importing necessary modules from NestJS and other files
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { TokenTypeEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import type { UserDocument } from 'src/DB/models/user.model';
import {
  CreateBrandDto,
  FreezeBrandDto,
  IdDto,
  QueryBrandDto,
  UpdateBrandDto,
} from './dto/brand.dto';

//* BrandController class to handle the brand related requests
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //* The createBrand method handles the creation of a new brand
  @Post('create')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.admin],
  })
  @UseInterceptors(FileInterceptor('attachment', multerCloud()))
  createBrand(
    @Body() body: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserDocument,
  ) {
    return this.brandService.createBrand(body, file, user);
  }

  //* The updateBrand method handles the updating of an existing brand
  @Patch('update/:id')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.admin],
  })
  updateBrand(
    @Param() params: IdDto,
    @Body() body: UpdateBrandDto,
    @User() user: UserDocument,
  ) {
    return this.brandService.updateBrand(body, params.id, user);
  }

  //* The getAllBrands method retrieves all brands based on the provided query parameters
  @Get()
  getAllBrands(@Query() query: QueryBrandDto) {
    return this.brandService.getAllBrands(query);
  }

  //* The getBrandById method retrieves a brand by its ID
  @Get(':id')
  getBrandById(@Param() params: IdDto) {
    return this.brandService.getBrandById(params.id);
  }

  //* The freezeBrand method handles the soft deletion of a brand by its ID
  @Delete('freeze/:id')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.admin],
  })
  freezeBrand(@Param() params: IdDto, @User() user: UserDocument) {
    return this.brandService.freezeBrand(params.id, user);
  }

  //* The restoreBrand method handles the restoration of all soft-deleted brands
  @Patch('restore')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.admin],
  })
  restoreBrand(@Param() params: IdDto, @User() user: UserDocument) {
    return this.brandService.restoreBrand(params.id, user);
  }

  //* The deleteBrand method handles the permanent deletion of a brand by its ID
  @Delete('delete/:id')
  @Auth({
    token_Type_Key: TokenTypeEnum.access_token,
    role_Type_Key: [RoleEnum.admin],
  })
  deleteBrand(@Param() params: IdDto, @User() user: UserDocument) {
    return this.brandService.deleteBrand(params.id, user);
  }
}
