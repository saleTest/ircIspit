import { Product } from '../products-component/product.interface';

export class Order {
  id!: number;
  items: Product[] = [];
  totalPrice!: number;
  name!: string;
  address!: string;
  phone!: number;
  email!: string;
  postalCodeAndCity!: string;
  paymentId!: string;
  createdAt!: string;
  status!: string;
  date!: string;
  shippingFees!: number;
}
