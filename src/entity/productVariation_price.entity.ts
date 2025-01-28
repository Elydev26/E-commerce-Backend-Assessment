import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Country } from './country.entity';
import { Currency } from './currency.entity';
import { ProductVariation } from './productVariation.entity';

@Entity()
export class ProductVariationPrice {
  @PrimaryGeneratedColumn()
   id!: number;

  @ManyToOne(() => ProductVariation)
  @JoinColumn({ name: 'productVariationId' })
   productVariation: ProductVariation;

  @Column({ type: 'int' })
   productVariationId: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryCode' })
   country: Country;

  @Column({ type: 'varchar', length: 7 })
   countryCode: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currencyCode' })
   currency: Currency;

  @Column({ type: 'varchar', length: 7 })
   currencyCode: string;

  @Column({ type: 'numeric' })
   price: number;

  @CreateDateColumn({ type: 'timestamp' })
   createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
   updatedAt!: Date;
}
