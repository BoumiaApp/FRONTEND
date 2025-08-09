import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { BoxIcon } from "../../icons";
import Button from "../ui/button/Button";
import { Customer, UpdateCustomerRequest, CUSTOMER_TYPE_LABELS } from "../../types/customer";
import { customerAPI } from "../../services/customerApi";

interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
  onDeleteCustomer: (customerId: number) => Promise<void>;
  onToggleCustomerStatus: (customerId: number, currentStatus: boolean) => Promise<void>;
}

export default function CustomersTable({ customers, loading, onDeleteCustomer, onToggleCustomerStatus }: CustomersTableProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateCustomerRequest>({
    code: '',
    name: '',
    taxNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    countrySubentity: '',
    citySubdivision: '',
    isEnabled: true,
    isTaxExempt: false,
    isSupplier: false,
    dueDatePeriod: 30,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      code: customer.code,
      name: customer.name,
      taxNumber: customer.taxNumber || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      postalCode: customer.postalCode || '',
      country: customer.country || '',
      countrySubentity: customer.countrySubentity || '',
      citySubdivision: customer.citySubdivision || '',
      isEnabled: customer.isEnabled,
      isTaxExempt: customer.isTaxExempt,
      isSupplier: customer.isSupplier,
      dueDatePeriod: customer.dueDatePeriod || 30,
    });
    setEditError(null);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      setEditLoading(true);
      setEditError(null);
      await customerAPI.updateCustomer(editingCustomer.id, editFormData);
      setEditingCustomer(null);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading customers...</span>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["Customer", "Contact", "Type", "Status", "Location"].map((header) => (
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
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <TableCell className="px-5 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Code: {customer.code}
                          </p>
                          {customer.taxNumber && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Tax: {customer.taxNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-left text-sm text-gray-600 dark:text-gray-300">
                      <div className="space-y-1">
                        {customer.email && (
                          <a href={`mailto:${customer.email}`} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {customer.email}
                          </a>
                        )}
                        {customer.phone && (
                          <a href={`tel:${customer.phone}`} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {customer.phone}
                          </a>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-left text-sm text-gray-600 dark:text-gray-300">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.isSupplier
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {customer.isSupplier ? 'Supplier' : 'Customer'}
                        </span>
                        {customer.isTaxExempt && (
                          <span className="block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            Tax Exempt
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-left">
                      <Badge
                        size="sm"
                        color={customer.isEnabled ? "success" : "error"}
                      >
                        {customer.isEnabled ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-left text-sm text-gray-600 dark:text-gray-300">
                      <div className="space-y-1">
                        {customer.city && (
                          <p className="font-medium">{customer.city}</p>
                        )}
                        {customer.country && (
                          <p className="text-xs">{customer.country}</p>
                        )}
                        {customer.postalCode && (
                          <p className="text-xs">Postal: {customer.postalCode}</p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <BoxIcon className="size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-1 ${
                          customer.isEnabled
                            ? 'hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400'
                        }`}
                        onClick={() => onToggleCustomerStatus(customer.id, customer.isEnabled)}
                      >
                        {customer.isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => onDeleteCustomer(customer.id)}
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Customer</h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={editLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {editError}
                </div>
              </div>
            )}
            
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code *</label>
                  <input
                    type="text"
                    value={editFormData.code}
                    onChange={(e) => setEditFormData({...editFormData, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Number</label>
                  <input
                    type="text"
                    value={editFormData.taxNumber}
                    onChange={(e) => setEditFormData({...editFormData, taxNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date Period (days)</label>
                  <input
                    type="number"
                    value={editFormData.dueDatePeriod}
                    onChange={(e) => setEditFormData({...editFormData, dueDatePeriod: parseInt(e.target.value) || 30})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={editFormData.postalCode}
                    onChange={(e) => setEditFormData({...editFormData, postalCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country Subentity</label>
                  <input
                    type="text"
                    value={editFormData.countrySubentity}
                    onChange={(e) => setEditFormData({...editFormData, countrySubentity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City Subdivision</label>
                  <input
                    type="text"
                    value={editFormData.citySubdivision}
                    onChange={(e) => setEditFormData({...editFormData, citySubdivision: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEnabled"
                    checked={editFormData.isEnabled}
                    onChange={(e) => setEditFormData({...editFormData, isEnabled: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="isEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Customer is enabled</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTaxExempt"
                    checked={editFormData.isTaxExempt}
                    onChange={(e) => setEditFormData({...editFormData, isTaxExempt: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="isTaxExempt" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tax exempt</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSupplier"
                    checked={editFormData.isSupplier}
                    onChange={(e) => setEditFormData({...editFormData, isSupplier: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="isSupplier" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Is supplier</label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  disabled={editLoading}
                  className="flex-1"
                >
                  {editLoading ? 'Updating...' : 'Update Customer'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingCustomer(null)}
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