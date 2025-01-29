import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { Country, Countries, CountryCodes } from '../../../../entity/country.entity';

@Injectable()
export class CountrySeeder implements SeederInterface {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async seed() {
    const data: Partial<Country>[] = this.generateData();
    await this.countryRepository.upsert(data, {
      conflictPaths: ['code'],
    });
  }

  generateData(): Partial<Country>[] {
    const data: Partial<Country>[] = [];
    Object.keys(Countries).forEach((key) => {
      data.push({
        code: CountryCodes[key],
        name: Countries[key],
      });
    });
    return data;
  }
}
