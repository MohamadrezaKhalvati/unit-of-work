import { BaseEntity } from "src/core/base";
import { OrderItem } from "src/module/product/entities/order-item.entity";
import { User } from "src/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderStatus } from "../enum/order-status.enum";


@Entity()
export class Order extends BaseEntity  {
	@Column({ type: 'decimal', precision: 10, scale: 2 })
	totalPrice: number;
  
	@Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
	status: OrderStatus;
  
	@Column({ type: 'int' }) 
	user_id: number;
  
	@ManyToOne(() => User, user => user.orders)
	@JoinColumn({ name: 'user_id' })
	user: User;
  
	@OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true }) 
	orderItems: OrderItem[];
}
