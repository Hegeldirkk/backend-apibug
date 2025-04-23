import { IsOptional, IsString } from 'class-validator';

export class CreateReportMessageDto {
  @IsString()
  content: string;

  @IsString()
  reportId: string;

  @IsOptional()
  @IsString()
  files: Array<{ type: 'image' | 'video' | 'autre'; url: string }>;


}
