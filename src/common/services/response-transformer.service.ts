import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ResponseTransformerService {
  /**
   * Nettoie et transforme les données retournées, en supprimant certains champs sensibles
   * @param data Les données à transformer
   */
  transform<T>(data: T, groups: string[] = []) {
    return instanceToPlain(data, {
      groups,
      exposeUnsetFields: false,
    });
  }
}
