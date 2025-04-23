import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hacker } from './hacker.entity';

@Injectable()
export class HackerService {
  constructor(
    @InjectRepository(Hacker)
    private hackerRepo: Repository<Hacker>,
  ) {}

  async getProfile(id: string): Promise<Hacker> {
    const hacker = await this.hackerRepo.findOne({
      where: { user: { id } },
    });

    if (!hacker) {
      throw new NotFoundException('Hacker non trouvé');
    }

    return hacker;
  }
}
