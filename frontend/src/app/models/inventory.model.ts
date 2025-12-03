export interface InventoryRequest {
  productId: number;
  quantity: number;
  batchId: string;
  importDate: string;
  expirationDate: string;
  unitOfMeasure: string;
}

export interface InventoryResponse {
  id: number;
  productId: number;
  quantity: number;
  batchId: string;
  importDate: string;
  expirationDate: string;
  unitOfMeasure: string;
}
