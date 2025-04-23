import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Put,
  UseInterceptors,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put('selfie')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }]))
  async updateSelfie(
    @Request() req,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
    },
  ) {
    return this.userService.updateSelfie(req.user.id, files);
  }
}
