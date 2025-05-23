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
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-company-profile.dto';
import { UserRole } from 'src/user/user.entity';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // @Post()
  // create(@Body() dto: CreateCompanyDto) {
  //   return this.companyService.create(dto);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'registre_commerce', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
    ]),
  )
  async updateCompany(
    @Request() req,
    @Body() dto: UpdateCompanyDto,
    @UploadedFiles()
    files: {
      registre_commerce?: Express.Multer.File[];
      avatar?: Express.Multer.File[];
    },
  ) {
    const role = req.user.role;
    const ait = req.user.ait;

    if (role !== UserRole.ENTREPRISE && ait!== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return this.companyService.updateCompanyInfo(req, dto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const role = req.user.role;
    const ait = req.user.ait;

    if (role !== UserRole.ENTREPRISE && ait!== 2) {
      return {
        success: false,
        message: 'Access denied',
      };
    }
    return this.companyService.getCompanyProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
    return this.companyService.updateCompanyProfile(req.user, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req, companyId: string) {
    return this.companyService.getStatistics(req.user.id);
  }


}
