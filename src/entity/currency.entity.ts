import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Currency {
  @PrimaryColumn({ type: 'varchar', length: 7 })
 code!: string;

  @Column({ type: 'varchar' })
   name: string;

  @CreateDateColumn({ type: 'timestamp' })
   createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
 updatedAt!: Date;
}

export enum CurrencyCodes {
  NGN = 'NGN',
}

export enum CurrencyNames {
  NGN = 'Nigerian Naira', 
}
