export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  img: string;
  quantity: number | 1;
  productCode: string;
  rating: number;
  size: string[];
  color: string[];
}
