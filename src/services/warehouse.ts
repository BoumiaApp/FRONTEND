import api from "./api";

export const warehouseAPI = {
  getAllWarehouses: () => api.get("/api/warehouse"),
  getWarehouseById: (id: number) => api.get(`/api/warehouse/${id}`),
  createWarehouse: (warehouseData: { name: string }) =>
    api.post("/api/warehouse", warehouseData),
  updateWarehouse: (
    id: number,
    warehouseData: {
      name?: string;
    }
  ) => api.put(`/api/warehouse/${id}`, warehouseData),
  deleteWarehouse: (id: number) => api.delete(`/api/warehouse/${id}`),
};
