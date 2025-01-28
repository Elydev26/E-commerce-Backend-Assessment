import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Size {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  code!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

export enum SizeCodes {
  NA = 'NA',
  Small = 'S',
  Medium = 'M',
  Large = 'L',
  XLarge = 'XL',
  XXLarge = 'XXL',
}
