import { BadRequestException } from '@nestjs/common';
import { TypeHelpOptions } from 'class-transformer';
import { ComputerDetails } from './computer.details';
import { TestDetails } from './test.details';
import { Categories } from '../../../..//entity/category.entity';

export type ProductDetails = ComputerDetails | TestDetails;

export function ProductDetailsTypeFn(options: TypeHelpOptions) {
  switch (options.object?.details?.category) {
    case Categories.Computers:
      return ComputerDetails;
    case 'Test':
      return TestDetails;
  }

  throw new BadRequestException('invalid details.category input');
}
