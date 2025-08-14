import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { BoxIcon } from "../../icons";
import Button from "../ui/button/Button";
import { Warehouse } from "../../types/warehouse";
import { warehouseAPI } from "../../services/warehouse";

interface UsersTablesProps {
  warehouses: Warehouse[];
  loading: boolean;
  onDeleteWarehouse: (userId: number) => Promise<void>;
}

export default function WarehouseTable({
  warehouses,
  loading,
  onDeleteWarehouse,
}: UsersTablesProps) {
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    name: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setEditFormData({
      name: warehouse.name,
    });
    setEditError(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarehouse) return;

    try {
      setEditLoading(true);
      setEditError(null);
      await warehouseAPI.updateWarehouse(editingWarehouse.id, editFormData);
      setEditingWarehouse(null);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err: any) {
      setEditError(err.response?.data || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading warehouses...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["index", "Name"].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                  >
                    {header}
                  </TableCell>
                ))}
                <TableCell
                  key={"Actions"}
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-center text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {warehouses.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium">No warehouses found</p>
                      <p className="text-sm">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((warehouse) => (
                  <TableRow
                    key={warehouse.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <TableCell className="px-5 py-4 text-left text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {warehouse.name.charAt(0)}
                        {warehouse.name.charAt(0)}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {warehouse.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleEditWarehouse(warehouse)}
                      >
                        <BoxIcon className="size-4" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => onDeleteWarehouse(warehouse.id)}
                      >
                        <BoxIcon className="size-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit User
              </h3>
              <button
                onClick={() => setEditingWarehouse(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={editLoading}
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

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {editError}
                </div>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                  disabled={editLoading}
                  className="flex-1"
                >
                  {editLoading ? "Updating..." : "Update User"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingWarehouse(null)}
                  className="flex-1"
                  disabled={editLoading}
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
