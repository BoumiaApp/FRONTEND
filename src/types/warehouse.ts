export interface Warehouse {
  id: number;
  name: string;
}
export interface CreateWarehouseRequest {
  name: string;
}
export interface UpdateWarehouseRequest {
  name?: string;
}