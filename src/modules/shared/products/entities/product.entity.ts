import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from '../../product-images/entities/product-image.entity';
import { Favorite } from '../../../customer/favorite/entities/favorite.entity';
import { Report } from '../../reports/entities/report.entity';

@Entity({ orderBy: { createdAt: 'DESC' } })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  categoryId: number;

  @Column()
  subCategoryId: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ type: 'text' })
  mainImage: string;

  @Column()
  discount: number;

  @Column()
  isBestOffers: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // many to one.
  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(
    () => Category,
    (subCategory) => subCategory.productsFromSubCategory,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: Category;

  @ManyToOne(() => Category, (category) => category.productsFromCategory)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // on to many.
  @OneToMany(() => Favorite, (favorite) => favorite.product, { cascade: true })
  favorites: Favorite[];

  @OneToMany(() => Report, (report) => report.product, { cascade: true })
  reports: Report[];

  // @OneToMany(() => Order, (order) => order.product, { cascade: true })
  // orders: Order[];

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  // @OneToMany(() => Chat, (chat) => chat.product, { cascade: true })
  // chats: Chat[];

  // @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  // comments: Comment[];
}
