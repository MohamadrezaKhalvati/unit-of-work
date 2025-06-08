import { BaseEntity } from "src/core/base";
import { Order } from "src/module/order/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class OrderItem extends BaseEntity {
	@Column({ type: 'int' })
	quantity: number;
  
	@Column({ type: 'decimal', precision: 10, scale: 2 })
	priceAtOrder: number; 
  
	@Column({ type: 'int' }) 
	order_id: number;
  
	@Column({ type: 'int' }) 
	product_id: number;
  
	@ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'order_id' })
	order: Order;
  
	@ManyToOne(() => Product, product => product.orderItems, { onDelete: 'RESTRICT' })
	@JoinColumn({ name: 'product_id' })
	product: Product;
  
}

