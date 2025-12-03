export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerId: number;
  orderItems: OrderItemRequest[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  customerId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  orderItems: OrderItemResponse[];
}
