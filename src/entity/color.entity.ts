import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Color {
  @PrimaryColumn({ type: 'varchar', length: 30 })
   name: string;

  @Column({ type: 'varchar', length: 10 })
   hexCode: string;

  @CreateDateColumn({ type: 'timestamp' })
   createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
   updatedAt!: Date;
}

export enum Colors {
  NA = 'NA',
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

export enum ColorsHexCodes {
  NA = 'NA',
  Red = '#FF0000',
  Green = '#00FF00',
  Blue = '#0000FF',
}
