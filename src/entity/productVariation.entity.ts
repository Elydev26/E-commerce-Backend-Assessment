import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Color } from './color.entity';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity()
export class ProductVariation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Size)
  @JoinColumn({ name: 'sizeCode' })
  size: Size;

  @Column({ type: 'varchar', length: 7 })
  sizeCode: string;

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'colorName' })
  color: Color;

  @Column({ type: 'varchar', length: 30 })
  colorName: string;

  @Column({ type: 'text', array: true, default: [] })
  imageUrls: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
