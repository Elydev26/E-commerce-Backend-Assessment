import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { Size, SizeCodes } from '../../../../entity/size.entity';

@Injectable()
export class SizeSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Size)
    private readonly SizeRepository: Repository<Size>,
  ) {}

  async seed() {
    const data: Partial<Size>[] = this.generateData();
    await this.SizeRepository.upsert(data, {
      conflictPaths: ['code'],
    });
  }

  generateData(): Partial<Size>[] {
    const data: Partial<Size>[] = [];
    Object.keys(SizeCodes).forEach((key) => {
      data.push({
        code: SizeCodes[key],
      });
    });
    return data;
  }
}
