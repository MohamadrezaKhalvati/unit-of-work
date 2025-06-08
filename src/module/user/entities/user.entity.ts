import { BaseEntity } from "src/core/base";
import { Order } from "src/module/order/entities/order.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
