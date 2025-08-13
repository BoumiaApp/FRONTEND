import { CreateOrderPayload } from "../types/order";
import api from "./api";

export const orderAPI = {
  getAllOrders: () => api.get("/api/posorders"),
  //   getWarehouseById: (id: number) => api.get(`/api/warehouse/${id}`),
  createOrder: (orderData: CreateOrderPayload) =>
    api.post("/api/posorders", orderData),
  deleteOrder: (id: number) => api.delete(`/api/posorders/${id}`),

  //   updateWarehouse: (
  //     id: number,
  //     warehouseData: {
  //       name?: string;
  //     }
  //   ) => api.put(`/api/warehouse/${id}`, warehouseData),
  //   deleteWarehouse: (id: number) => api.delete(`/api/warehouse/${id}`),
};
