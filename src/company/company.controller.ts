import {
  Controller,
  Request,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'registre_commerce', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  async updateCompany(
    @Request() req,
    @Body() dto: UpdateCompanyDto,
    @UploadedFiles()
    files: {
      registre_commerce?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
  ) {
    return this.companyService.updateCompanyInfo(req, dto, files);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
