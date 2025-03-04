import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { Currency, CurrencyCodes, CurrencyNames } from '../../../../entity/currency.entity';

@Injectable()
export class CurrencySeeder implements SeederInterface {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async seed() {
    const data: Partial<Currency>[] = this.generateData();
    await this.currencyRepository.upsert(data, {
      conflictPaths: ['code'],
    });
  }

  generateData(): Partial<Currency>[] {
    const data: Partial<Currency>[] = [];
    Object.keys(CurrencyCodes).forEach((key) => {
      data.push({
        code: CurrencyCodes[key],
        name: CurrencyNames[key],
      });
    });
    return data;
  }
}
