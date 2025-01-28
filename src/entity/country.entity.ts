import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Country {
  @PrimaryColumn({ type: 'varchar', length: 7 })
   code!: string;

  @Column({ type: 'varchar' })
   name: string;

  @CreateDateColumn({ type: 'timestamp' })
   createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
 updatedAt!: Date;
}

export enum CountryCodes {
  Egypt = 'EG',
}

export enum Countries {
  Egypt = 'Egypt',
}
