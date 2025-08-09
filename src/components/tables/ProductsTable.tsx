import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { BoxIcon } from "../../icons";
import Button from "../ui/button/Button";
import { Product, UpdateProductRequest } from "../../types/product";
import { productAPI } from "../../services/productApi";
import { productGroupAPI } from "../../services/productGroupApi";

import { ProductGroup } from "../../types/productGroup";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onDeleteProduct: (productId: number) => Promise<void>;
  onToggleProductStatus: (productId: number, currentStatus: boolean) => Promise<void>;
  onUpdateProduct: (productId: number, updatedProduct: Product) => void;
}

export default function ProductsTable({ products, loading, onDeleteProduct, onToggleProductStatus, onUpdateProduct }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateProductRequest>({
    code: '',
    barcode: '',
    name: '',
    description: '',
    productGroupId: undefined,
    price: 0,
    cost: 0,
    isEnabled: true,
    isService: false,
    isPriceChangeAllowed: true,
    isTaxInclusive: false,
    usesDefaultQuantity: false,
    rank: 0
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);

  useEffect(() => {
    fetchProductGroups();
  }, []);

  const fetchProductGroups = async () => {
    try {
      const response = await productGroupAPI.getAllProductGroups();
      setProductGroups(response.data);
    } catch (error) {
      console.error('Error fetching product groups:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      code: product.code || '',
      barcode: product.barcode || '',
      name: product.name,
      description: product.description || '',
      productGroupId: product.productGroupId,
      price: product.price,
      cost: product.cost || 0,
      isEnabled: product.isEnabled,
      isService: product.isService,
      isPriceChangeAllowed: product.isPriceChangeAllowed,
      isTaxInclusive: product.isTaxInclusive,
      usesDefaultQuantity: product.usesDefaultQuantity,
      rank: product.rank || 0
    });
    setEditError('');
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !editFormData.name) {
      setEditError('Name is required field');
      return;
    }

    try {
      setEditLoading(true);
      setEditError('');
      
      const response = await productAPI.updateProduct(editingProduct.id, editFormData);
      
      // Update the product in the parent component
      const updatedProduct = response.data;
      onUpdateProduct(editingProduct.id, updatedProduct);
      
      setEditingProduct(null);
      setEditFormData({
        code: '',
        barcode: '',
        name: '',
        description: '',
        productGroupId: undefined,
        price: 0,
        cost: 0,
        isEnabled: true,
        isService: false,
        isPriceChangeAllowed: true,
        isTaxInclusive: false,
        usesDefaultQuantity: false,
        rank: 0
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      setEditError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No products found
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Product
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Code/Barcode
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Price/Cost
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Group
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Properties
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
                >
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <BoxIcon className="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="space-y-1">
                      {product.code && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Code:</span> {product.code}
                        </div>
                      )}
                      {product.barcode && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Barcode:</span> {product.barcode}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.cost && product.cost > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Cost: ${product.cost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="space-y-1">
                      {product.productGroup && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Group:</span> {product.productGroup.name}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <Badge
                      size="sm"
                      color={product.isEnabled ? "success" : "error"}
                    >
                      {product.isEnabled ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isService && (
                        <Badge size="sm" color="info">Service</Badge>
                      )}
                      {product.isPriceChangeAllowed && (
                        <Badge size="sm" color="warning">Price Change</Badge>
                      )}
                      {product.isTaxInclusive && (
                        <Badge size="sm" color="success">Tax Inclusive</Badge>
                      )}
                      {product.usesDefaultQuantity && (
                        <Badge size="sm" color="primary">Default Qty</Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center gap-1"
                      >
                        <BoxIcon className="size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleProductStatus(product.id, product.isEnabled)}
                        className={`flex items-center gap-1 ${
                          product.isEnabled 
                            ? 'text-orange-500 hover:text-orange-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                      >
                        <BoxIcon className="size-4" />
                        {product.isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteProduct(product.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700"
                      >
                        <BoxIcon className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <BoxIcon className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({...editFormData, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Product code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Barcode</label>
                <input
                  type="text"
                  value={editFormData.barcode || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, barcode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Enter barcode"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Group</label>
                <select
                  value={editFormData.productGroupId || ''}
                  onChange={(e) => setEditFormData({...editFormData, productGroupId: e.target.value ? parseInt(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                >
                  <option value="">Select Group</option>
                  {productGroups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.cost}
                  onChange={(e) => setEditFormData({...editFormData, cost: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rank</label>
                <input
                  type="number"
                  value={editFormData.rank || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, rank: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Rank"
                />
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isEnabled}
                      onChange={(e) => setEditFormData({...editFormData, isEnabled: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isService}
                      onChange={(e) => setEditFormData({...editFormData, isService: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Service</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isPriceChangeAllowed}
                      onChange={(e) => setEditFormData({...editFormData, isPriceChangeAllowed: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Price Change Allowed</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isTaxInclusive}
                      onChange={(e) => setEditFormData({...editFormData, isTaxInclusive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Tax Inclusive</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.usesDefaultQuantity}
                      onChange={(e) => setEditFormData({...editFormData, usesDefaultQuantity: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Uses Default Quantity</span>
                  </label>
                </div>
              </div>
            </div>

            {editError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {editError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingProduct(null)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateProduct}
                disabled={editLoading}
              >
                {editLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 