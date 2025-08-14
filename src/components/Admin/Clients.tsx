import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import PageMeta from "../common/PageMeta";
import CustomersTable from "../tables/CustomersTable";
import Button from "../ui/button/Button";
import { BoxIcon } from "../../icons";
import { customerAPI } from "../../services/customerApi";
import {
  Customer,
  CreateCustomerRequest,
} from "../../types/customer";

export default function Clients() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"general" | "name" | "contact">(
    "general"
  );
  const [filterType, setFilterType] = useState<
    "all" | "enabled" | "disabled" | "customers" | "suppliers" | "tax-exempt"
  >("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateCustomerRequest>({
    name: "",
    taxNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    countrySubentity: "",
    citySubdivisionName: "",
    isEnabled: true,
    isTaxExempt: false,
    isSupplier: false,
    dueDatePeriod: 30,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerAPI.getAllCustomers();
      const fetchedCustomers = response.data || [];
      setCustomers(fetchedCustomers);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await applyFilter("all");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let response;

      switch (searchType) {
        case "name":
          response = await customerAPI.searchCustomersByName(searchTerm);
          break;
        case "contact":
          response = await customerAPI.searchCustomersContact(searchTerm);
          break;
        case "general":
        default:
          response = await customerAPI.searchCustomersGeneral(searchTerm);
          break;
      }

      setCustomers(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async (filter: typeof filterType) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      switch (filter) {
        case "enabled":
          response = await customerAPI.getEnabledCustomers();
          break;
        case "disabled":
          response = await customerAPI.getDisabledCustomers();
          break;
        case "customers":
          response = await customerAPI.getCustomersOnly();
          break;
        case "suppliers":
          response = await customerAPI.getSuppliersOnly();
          break;
        case "tax-exempt":
          response = await customerAPI.getTaxExemptCustomers();
          break;
        case "all":
        default:
          response = await customerAPI.getAllCustomers();
          break;
      }

      setCustomers(response.data || []);
      setFilterType(filter);
    } catch (err: any) {
      setError(err.response?.data?.message || "Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.name) {
      setError("Name is required field");
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);
      console.log(createFormData);
      await customerAPI.createCustomer(createFormData);

      // Reset form and close modal
      setCreateFormData({
        name: "",
        taxNumber: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        countrySubentity: "",
        citySubdivisionName: "",
        isEnabled: true,
        isTaxExempt: false,
        isSupplier: false,
        dueDatePeriod: 30,
      });
      setShowCreateModal(false);

      // Refresh customers list
      fetchCustomers();
    } catch (err: any) {
      setError(err.response?.data || "Failed to create customer");
      console.error("Create customer error:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      setError(null);
      await customerAPI.deleteCustomer(customerId);
      fetchCustomers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete customer");
    }
  };

  const handleToggleCustomerStatus = async (
    customerId: number,
    currentStatus: boolean
  ) => {
    try {
      setError(null);
      if (currentStatus) {
        await customerAPI.disableCustomer(customerId);
      } else {
        await customerAPI.enableCustomer(customerId);
      }
      await fetchCustomers();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update customer status"
      );
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <PageMeta
        title="Customer Management | Boumia Admin Dashboard"
        description="Manage customers, suppliers, and business contacts"
      />
      <PageBreadcrumb pageTitle="Customer Management" />
      <div className="space-y-6">
        <ComponentCard title="Customers">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="flex gap-2">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  <option value="general">General Search</option>
                  <option value="name">Search by Name</option>
                  <option value="contact">Search by Contact</option>
                </select>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 min-w-[200px]"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSearch}
                  className="whitespace-nowrap"
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => applyFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              >
                <option value="all">All Customers</option>
                <option value="enabled">Enabled Only</option>
                <option value="disabled">Disabled Only</option>
                <option value="customers">Customers Only</option>
                <option value="suppliers">Suppliers Only</option>
                <option value="tax-exempt">Tax Exempt</option>
              </select>

              <Button
                size="sm"
                variant="primary"
                startIcon={<BoxIcon className="size-4" />}
                onClick={() => setShowCreateModal(true)}
                className="whitespace-nowrap"
              >
                Add Customer
              </Button>
            </div>
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

          <CustomersTable
            customers={customers}
            loading={loading}
            onDeleteCustomer={handleDeleteCustomer}
            onToggleCustomerStatus={handleToggleCustomerStatus}
          />
        </ComponentCard>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Customer
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
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax Number
                  </label>
                  <input
                    type="text"
                    value={createFormData.taxNumber}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        taxNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={createFormData.phone}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date Period (days)
                  </label>
                  <input
                    type="number"
                    value={createFormData.dueDatePeriod}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        dueDatePeriod: parseInt(e.target.value) || 30,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={createFormData.address}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={createFormData.city}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={createFormData.postalCode}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={createFormData.country}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country Subentity
                  </label>
                  <input
                    type="text"
                    value={createFormData.countrySubentity}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        countrySubentity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City Subdivision
                  </label>
                  <input
                    type="text"
                    value={createFormData.citySubdivisionName}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        citySubdivisionName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEnabled"
                    checked={createFormData.isEnabled}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        isEnabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="isEnabled"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Customer is enabled
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTaxExempt"
                    checked={createFormData.isTaxExempt}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        isTaxExempt: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="isTaxExempt"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Tax exempt
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSupplier"
                    checked={createFormData.isSupplier}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        isSupplier: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="isSupplier"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Is supplier
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? "Creating..." : "Create Customer"}
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
