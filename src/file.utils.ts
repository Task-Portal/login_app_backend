import { extname } from 'path';
import { Request } from 'express';
import { FILE_TYPES } from './constants';
import { BadRequestException } from '@nestjs/common';

export const fileNameEditor = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: any, filename) => void,
) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, uniqueSuffix + extname(file.originalname));
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: any, valid: boolean) => void,
) => {
  const extensionRegex = new RegExp(`\\.${FILE_TYPES}$`, 'i');
  if (!file.originalname || !file.originalname.match(extensionRegex)) {
    return callback(
      new BadRequestException(
        `Unsupported file type. Supported extensions are: ${FILE_TYPES.replace(/\|/g, ', ')}`,
      ),
      false,
    );
  }
  callback(null, true);
};
