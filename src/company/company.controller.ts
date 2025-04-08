import { Controller, Request, Post, Body, Get, Param, Patch, Delete, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads/companies',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateCompany(
    @Request() req,
    @Body() dto: UpdateCompanyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const fileMap = {};
    files.forEach((file) => {
      if (file.originalname.includes('logo')) fileMap['logo'] = file.path;
      if (file.originalname.includes('registre')) fileMap['registre_commerce'] = file.path;
    });

    return this.companyService.updateCompanyInfo(req.user.id, dto, fileMap);
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
