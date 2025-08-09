import api from "./api";

export const warehouseAPI = {
  getAllWarehouses: () => api.get("/api/warehouse"),
  getWarehouseById: (id: number) => api.get(`/api/warehouse/${id}`),
  createWarehouse: (warehouseData: { name: string }) =>
    api.post("/api/warehouse", warehouseData),
  //   updateUser: (id: number, userData: {
  //     firstName?: string;
  //     lastName?: string;
  //     username?: string;
  //     accessLevel?: number;
  //     isEnabled?: boolean;
  //     email?: string;
  //   }) => api.put(`/api/users/${id}`, userData),
  //   deleteUser: (id: number) => api.delete(`/api/users/${id}`),
};
