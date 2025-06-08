import { Order } from "src/module/order/entities/order.entity";
import { OrderItem } from "src/module/product/entities/order-item.entity";
import { Product } from "src/module/product/entities/product.entity";
import { User } from "src/module/user/entities/user.entity";

export const TypeOrmModels = [User, Product, Order, OrderItem]
