import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Module({
  imports: [UploadModule], // 🔁 Si vous avez d'autres modules à importer, ajoutez-les ici
  providers: [UploadService],
  exports: [UploadService], // 🔁 Pour l'importer dans d'autres modules
})
export class UploadModule {}
