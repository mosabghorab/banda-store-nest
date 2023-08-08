import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { UserStatus } from '../enums/user-status.enum';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { Favorite } from '../../../customer/favorite/entities/favorite.entity';
import { AdminsRoles } from '../../../admin/admins-roles/entities/admins-roles.entity';
import { UserType } from '../enums/user-type.enum';

@Entity({ orderBy: { createdAt: 'DESC' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  type: UserType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isNotificationsEnabled: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.
  @OneToMany(() => Category, (category) => category.user, { cascade: true })
  categories: Category[];

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products: Product[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
  favorites: Favorite[];

  // @OneToMany(() => Order, (order) => order.buyer, { cascade: true })
  // ordersFromBuyers: Order[];
  //
  // @OneToMany(() => Order, (order) => order.seller, { cascade: true })
  // ordersFromSellers: Order[];
  //
  // @OneToMany(() => Chat, (chat) => chat.buyer, { cascade: true })
  // chatsAsBuyer: Chat[];
  //
  // @OneToMany(() => Chat, (chat) => chat.seller, { cascade: true })
  // chatsAsSeller: Chat[];
  //
  // @OneToMany(() => Message, (message) => message.sender, { cascade: true })
  // messagesAsSender: Message[];
  //
  // @OneToMany(() => Message, (message) => message.receiver, { cascade: true })
  // messagesAsReceiver: Message[];
  //
  // @OneToMany(() => Comment, (comment) => comment.seller, { cascade: true })
  // commentsAsSeller: Comment[];
  //
  // @OneToMany(() => Comment, (comment) => comment.buyer, { cascade: true })
  // commentsAsBuyer: Comment[];
  //
  @OneToMany(() => AdminsRoles, (userRole) => userRole.user, { cascade: true })
  adminsRoles: AdminsRoles[];

  // hooks.
  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      const salt = genSaltSync(10);
      this.password = hashSync(this.password, salt);
    }
  }

  // methods.
  async comparePassword(password: string) {
    return await compare(password, this.password);
  }
}
