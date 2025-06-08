import { BaseEntity } from "src/core/base";
import { Column, Entity, OneToMany } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Product extends BaseEntity  {
	@Column({ unique: true })
	name: string;
  
	@Column({ type: 'text', nullable: true })
	description: string;
  
	@Column({ type: 'decimal', precision: 10, scale: 2 })
	price: number;
  
	@Column({ type: 'int', default: 0 })
	stock: number;
  
	@OneToMany(() => OrderItem, orderItem => orderItem.product)
	orderItems: OrderItem[];
  
}
