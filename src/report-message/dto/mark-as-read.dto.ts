// src/report-message/dto/mark-as-read.dto.ts
import { IsUUID } from 'class-validator';

export class MarkMessageAsReadDto {
  @IsUUID()
  messageId: string;
}
