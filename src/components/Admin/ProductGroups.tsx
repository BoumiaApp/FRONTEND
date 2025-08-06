import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import PageMeta from "../common/PageMeta";
import ProductGroupsTable from "../tables/ProductGroupsTable";
import Button from "../ui/button/Button";
import { BoxIcon } from "../../icons";
import { productGroupAPI } from "../../services/api";
import { ProductGroup, CreateProductGroupRequest, PRODUCT_GROUP_COLORS, PRODUCT_GROUP_COLOR_LABELS } from "../../types/productGroup";

export default function ProductGroups() {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [allProductGroups, setAllProductGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'root' | 'by-color' | 'by-rank'>('all');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [rankRange, setRankRange] = useState({ min: 0, max: 100 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateProductGroupRequest>({
    name: '',
    description: '',
    color: PRODUCT_GROUP_COLORS.BLUE,
    rank: 0,
    parentGroupId: undefined,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productGroupAPI.getAllProductGroups();
      const fetchedGroups = response.data || [];
      setAllProductGroups(fetchedGroups);
      setProductGroups(fetchedGroups);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch product groups');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await applyFilter('all');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await productGroupAPI.searchProductGroupsByName(searchTerm);
      setProductGroups(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
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
        case 'root':
          response = await productGroupAPI.getRootProductGroups();
          break;
        case 'by-color':
          if (selectedColor) {
            response = await productGroupAPI.getProductGroupsByColor(selectedColor);
          } else {
            response = await productGroupAPI.getAllProductGroups();
          }
          break;
        case 'by-rank':
          response = await productGroupAPI.getProductGroupsByRankRange(rankRange.min, rankRange.max);
          break;
        case 'all':
        default:
          response = await productGroupAPI.getAllProductGroups();
          break;
      }
      
      setProductGroups(response.data || []);
      setFilterType(filter);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProductGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.name) {
      setError('Name is required field');
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);
      
      await productGroupAPI.createProductGroup(createFormData);
      
      // Reset form and close modal
      setCreateFormData({
        name: '',
        description: '',
        color: PRODUCT_GROUP_COLORS.BLUE,
        rank: 0,
        parentGroupId: undefined,
      });
      setShowCreateModal(false);
      
      // Refresh product groups list
      fetchProductGroups();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product group');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProductGroup = async (groupId: number) => {
    if (!window.confirm('Are you sure you want to delete this product group?')) {
      return;
    }

    try {
      setError(null);
      await productGroupAPI.deleteProductGroup(groupId);
      fetchProductGroups();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product group');
    }
  };

  useEffect(() => {
    fetchProductGroups();
  }, []);

  return (
    <>
      <PageMeta
        title="Product Groups Management | Boumia Admin Dashboard"
        description="Manage product groups and categories"
      />
      <PageBreadcrumb pageTitle="Product Groups Management" />
      <div className="space-y-6">
        <ComponentCard title="Product Groups">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search product groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                onChange={(e) => {
                  const filter = e.target.value as typeof filterType;
                  if (filter === 'by-color') {
                    setSelectedColor(PRODUCT_GROUP_COLORS.BLUE);
                  }
                  applyFilter(filter);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              >
                <option value="all">All Groups</option>
                <option value="root">Root Groups Only</option>
                <option value="by-color">Filter by Color</option>
                <option value="by-rank">Filter by Rank Range</option>
              </select>

              {filterType === 'by-color' && (
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    applyFilter('by-color');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  {Object.entries(PRODUCT_GROUP_COLOR_LABELS).map(([color, label]) => (
                    <option key={color} value={color}>{label}</option>
                  ))}
                </select>
              )}

              {filterType === 'by-rank' && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={rankRange.min}
                    onChange={(e) => setRankRange({...rankRange, min: parseInt(e.target.value) || 0})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 w-20"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={rankRange.max}
                    onChange={(e) => setRankRange({...rankRange, max: parseInt(e.target.value) || 100})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 w-20"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFilter('by-rank')}
                  >
                    Apply
                  </Button>
                </div>
              )}
              
              <Button
                size="sm"
                variant="primary"
                startIcon={<BoxIcon className="size-4" />}
                onClick={() => setShowCreateModal(true)}
                className="whitespace-nowrap"
              >
                Add Group
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <ProductGroupsTable 
            productGroups={productGroups}
            loading={loading}
            onDeleteProductGroup={handleDeleteProductGroup}
          />
        </ComponentCard>
      </div>

      {/* Create Product Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Product Group</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateProductGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
                  <select
                    value={createFormData.color}
                    onChange={(e) => setCreateFormData({...createFormData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  >
                    {Object.entries(PRODUCT_GROUP_COLOR_LABELS).map(([color, label]) => (
                      <option key={color} value={color}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rank</label>
                  <input
                    type="number"
                    value={createFormData.rank}
                    onChange={(e) => setCreateFormData({...createFormData, rank: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parent Group (Optional)</label>
                <select
                  value={createFormData.parentGroupId || ''}
                  onChange={(e) => setCreateFormData({...createFormData, parentGroupId: e.target.value ? parseInt(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                >
                  <option value="">No Parent (Root Group)</option>
                  {allProductGroups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? 'Creating...' : 'Create Group'}
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