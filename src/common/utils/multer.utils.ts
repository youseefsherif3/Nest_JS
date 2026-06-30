import multer from 'multer';
import { MulterEnum, Store_Enum } from '../enum/multer.enum';
import { tmpdir } from 'node:os';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const multerCloud = ({
  store_type = Store_Enum.memory,
  customType = MulterEnum.image,
}: {
  store_type?: Store_Enum;
  customType?: string[];
} = {}) => {
  const storage =
    store_type === Store_Enum.memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination: tmpdir(),
          filename: (req: Request, file: Express.Multer.File, cb: Function) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + '-' + file.originalname);
          },
        });

  function fileFilter(req: Request, file: Express.Multer.File, cb: Function) {
    if (!customType.includes(file.mimetype)) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    cb(null, true);
  }

  return {
    storage,
    fileFilter,
  };
};
