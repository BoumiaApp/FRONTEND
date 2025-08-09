import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import PageMeta from "../common/PageMeta";
import Button from "../ui/button/Button";
import { BoxIcon } from "../../icons";
import { userAPI } from "../../services/userApi";
import WarehouseTable from "../tables/WarehouseTable";
import { warehouseAPI } from "../../services/warehouse";
import { CreateWarehouseRequest, Warehouse } from "../../types/warehouse";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]); // Store all users for filtering
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateWarehouseRequest>({
    name: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseAPI.getAllWarehouses();
      const fetchedWarehouse = response.data || [];
      setAllWarehouses(fetchedWarehouse); // Store all users
      setWarehouses(fetchedWarehouse); // Initially show all users
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setWarehouses(allWarehouses); // Show all users when search is empty
      return;
    }

    // Filter users locally by name (firstName, lastName, or username)
    const filteredUsers = allWarehouses.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setWarehouses(filteredUsers);
  }, [searchTerm, allWarehouses]);

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.name) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);

      await warehouseAPI.createWarehouse(createFormData);

      // Reset form and close modal
      setCreateFormData({
        name: "",
      });
      setShowCreateModal(false);

      // Refresh Warehouses list
      fetchWarehouses();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setError(null);
      await userAPI.deleteUser(userId);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <>
      <PageMeta
        title="Warehouses Management | Boumia Admin Dashboard"
        description="Manage users, create new accounts, and control access levels"
      />
      <PageBreadcrumb pageTitle="Warehouses Management" />
      <div className="space-y-6">
        <ComponentCard title="Warehouses">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search warehouses by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 min-w-[250px]"
              />
            </div>
            <Button
              size="sm"
              variant="primary"
              startIcon={<BoxIcon className="size-4" />}
              onClick={() => setShowCreateModal(true)}
              className="whitespace-nowrap"
            >
              Add Warehouse
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <WarehouseTable
            warehouses={warehouses}
            loading={loading}
            onDeleteUser={handleDeleteUser}
          />
        </ComponentCard>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Warehouse
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="email"
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? "Creating..." : "Create Warehouse"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={createLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
