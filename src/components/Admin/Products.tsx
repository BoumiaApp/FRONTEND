import  { useState, useEffect } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import PageMeta from "../common/PageMeta";
import ProductsTable from "../tables/ProductsTable";
import Button from "../ui/button/Button";
import { BoxIcon } from "../../icons";
import { productAPI } from "../../services/productApi";
import { productGroupAPI } from "../../services/productGroupApi";
import {
  Product,
  CreateProductRequest,
  MEASUREMENT_UNITS,
  PRODUCT_COLORS,
} from "../../types/product";
import { ProductGroup } from "../../types/productGroup";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<
    "general" | "code" | "plu" | "name" | "barcode"
  >("general");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [costRange, setCostRange] = useState({ min: "", max: "" });
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [rankRange, setRankRange] = useState({ min: "", max: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateProductRequest>({
    code: "",
    plu: "",
    name: "",
    description: "",
    productGroupId: undefined,
    measurementUnit: "",
    price: 0,
    cost: 0,
    isEnabled: true,
    isService: false,
    isPriceChangeAllowed: true,
    isTaxInclusive: false,
    usesDefaultQuantity: false,
    color: "",
    ageRestriction: undefined,
    rank: 0,
    barcode: "",
    quantity: 0,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchProductGroups();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setProducts(allProducts);
    }
  }, [searchTerm, searchType, allProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductGroups = async () => {
    try {
      const response = await productGroupAPI.getAllProductGroups();
      setProductGroups(response.data);
    } catch (error) {
      console.error("Error fetching product groups:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setProducts(allProducts);
      return;
    }

    try {
      setLoading(true);
      let response;

      switch (searchType) {
        case "code":
          response = await productAPI.getProductByCode(searchTerm);
          setProducts([response.data]);
          break;
        case "plu":
          response = await productAPI.getProductByPLU(searchTerm);
          setProducts([response.data]);
          break;
        case "name":
          response = await productAPI.getProductByName(searchTerm);
          setProducts([response.data]);
          break;
        case "barcode":
          response = await productAPI.getProductByBarcode(searchTerm);
          setProducts([response.data]);
          break;
        default:
          response = await productAPI.searchProductsGeneral(searchTerm);
          setProducts(response.data);
          break;
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async () => {
    try {
      setLoading(true);
      let response;

      switch (filterType) {
        case "enabled":
          response = await productAPI.getEnabledProducts();
          break;
        case "disabled":
          response = await productAPI.getDisabledProducts();
          break;
        case "services":
          response = await productAPI.getServiceProducts();
          break;
        case "non-services":
          response = await productAPI.getNonServiceProducts();
          break;
        case "price-change-allowed":
          response = await productAPI.getPriceChangeAllowedProducts();
          break;
        case "tax-inclusive":
          response = await productAPI.getTaxInclusiveProducts();
          break;
        case "default-quantity":
          response = await productAPI.getDefaultQuantityProducts();
          break;
        case "by-group":
          if (selectedGroup) {
            response = await productAPI.getProductsByGroup(selectedGroup);
          } else {
            response = await productAPI.getAllProducts();
          }
          break;
        case "by-unit":
          if (selectedUnit) {
            response = await productAPI.getProductsByMeasurementUnit(
              selectedUnit
            );
          } else {
            response = await productAPI.getAllProducts();
          }
          break;
        case "by-color":
          if (selectedColor) {
            response = await productAPI.getProductsByColor(selectedColor);
          } else {
            response = await productAPI.getAllProducts();
          }
          break;
        case "by-age-restriction":
          if (rankRange.min && rankRange.max) {
            response = await productAPI.getProductsByRankRange(
              parseInt(rankRange.min),
              parseInt(rankRange.max)
            );
          } else {
            response = await productAPI.getAllProducts();
          }
          break;
        case "by-price-range":
          if (priceRange.min && priceRange.max) {
            response = await productAPI.getProductsByPriceRange(
              parseFloat(priceRange.min),
              parseFloat(priceRange.max)
            );
          } else {
            response = await productAPI.getAllProducts();
          }
          break;
        case "by-cost-range":
          if (costRange.min && costRange.max) {
            response = await productAPI.getProductsByCostRange(
              parseFloat(costRange.min),
              parseFloat(costRange.max)
            );
          } else {
            response = await productAPI.getAllProducts();
          }
          break;
        default:
          response = await productAPI.getAllProducts();
          break;
      }

      setProducts(response.data);
    } catch (error) {
      console.error("Error applying filter:", error);
      setError("Failed to apply filter");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!createFormData.name) {
      setError("Name is required field");
      return;
    }

    try {
      setCreateLoading(true);
      setError("");

      const response = await productAPI.createProduct(createFormData);
      setProducts([...products, response.data]);
      setAllProducts([...allProducts, response.data]);
      setShowCreateModal(false);
      setCreateFormData({
        code: "",
        plu: "",
        name: "",
        description: "",
        productGroupId: undefined,
        measurementUnit: "",
        price: 0,
        cost: 0,
        isEnabled: true,
        isService: false,
        isPriceChangeAllowed: true,
        isTaxInclusive: false,
        usesDefaultQuantity: false,
        color: "",
        ageRestriction: undefined,
        rank: 0,
        barcode: "",
        quantity: 0,
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      console.log("Error response:", error.response.data);
      
      setError(error.response.data|| "Failed to create product");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
      setAllProducts(allProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    }
  };

  const handleToggleProductStatus = async (
    productId: number,
    currentStatus: boolean
  ) => {
    try {
      if (currentStatus) {
        await productAPI.disableProduct(productId);
      } else {
        await productAPI.enableProduct(productId);
      }

      const updatedProducts = products.map((product) =>
        product.id === productId
          ? { ...product, isEnabled: !currentStatus }
          : product
      );
      setProducts(updatedProducts);
      setAllProducts(updatedProducts);
    } catch (error) {
      console.error("Error toggling product status:", error);
      setError("Failed to update product status");
    }
  };

  const handleUpdateProduct = (productId: number, updatedProduct: Product) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setAllProducts(updatedProducts);
  };

  return (
    <>
      <PageMeta
        title="Products Management | Admin Dashboard"
        description="Manage products, services, and inventory items"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <ComponentCard title="Products Management">
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              >
                <option value="general">General</option>
                <option value="code">Code</option>
                <option value="plu">PLU</option>
                <option value="name">Name</option>
                <option value="barcode">Barcode</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            >
              <option value="all">All Products</option>
              <option value="enabled">Enabled Only</option>
              <option value="disabled">Disabled Only</option>
              <option value="services">Services Only</option>
              <option value="non-services">Non-Services Only</option>
              <option value="price-change-allowed">Price Change Allowed</option>
              <option value="tax-inclusive">Tax Inclusive</option>
              <option value="default-quantity">Default Quantity</option>
              <option value="by-group">By Group</option>
              <option value="by-unit">By Unit</option>
              <option value="by-color">By Color</option>
              <option value="by-age-restriction">By Rank Range</option>
              <option value="by-price-range">By Price Range</option>
              <option value="by-cost-range">By Cost Range</option>
            </select>

            {filterType === "by-group" && (
              <select
                value={selectedGroup || ""}
                onChange={(e) =>
                  setSelectedGroup(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              >
                <option value="">Select Group</option>
                {productGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            )}

            {filterType === "by-unit" && (
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              >
                <option value="">Select Unit</option>
                {Object.values(MEASUREMENT_UNITS).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            )}

            {filterType === "by-color" && (
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              >
                <option value="">Select Color</option>
                {Object.values(PRODUCT_COLORS).map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}

            {(filterType === "by-age-restriction" ||
              filterType === "by-price-range" ||
              filterType === "by-cost-range") && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={
                    filterType === "by-age-restriction"
                      ? rankRange.min
                      : filterType === "by-price-range"
                      ? priceRange.min
                      : costRange.min
                  }
                  onChange={(e) => {
                    if (filterType === "by-age-restriction") {
                      setRankRange({ ...rankRange, min: e.target.value });
                    } else if (filterType === "by-price-range") {
                      setPriceRange({ ...priceRange, min: e.target.value });
                    } else {
                      setCostRange({ ...costRange, min: e.target.value });
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 w-20"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={
                    filterType === "by-age-restriction"
                      ? rankRange.max
                      : filterType === "by-price-range"
                      ? priceRange.max
                      : costRange.max
                  }
                  onChange={(e) => {
                    if (filterType === "by-age-restriction") {
                      setRankRange({ ...rankRange, max: e.target.value });
                    } else if (filterType === "by-price-range") {
                      setPriceRange({ ...priceRange, max: e.target.value });
                    } else {
                      setCostRange({ ...costRange, max: e.target.value });
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 w-20"
                />
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={applyFilter}
              className="flex items-center gap-1"
            >
              <BoxIcon className="size-4" />
              Apply Filter
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              startIcon={<BoxIcon className="size-4" />}
            >
              Add Product
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          <ProductsTable
            products={products}
            loading={loading}
            onDeleteProduct={handleDeleteProduct}
            onToggleProductStatus={handleToggleProductStatus}
            onUpdateProduct={handleUpdateProduct}
          />
        </ComponentCard>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Product
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <BoxIcon className="size-6" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  value={createFormData.code}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      code: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Product code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  value={createFormData.barcode || ""}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      barcode: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Enter barcode"
                />
              </div>

              <div className="md:col-span-2">
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
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Group
                </label>
                <select
                  value={createFormData.productGroupId || ""}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      productGroupId: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                >
                  <option value="">Select Group</option>
                  {productGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.price}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.cost}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      cost: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={createFormData.quantity || ""}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      quantity: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Quantity"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rank
                </label>
                <input
                  type="number"
                  value={createFormData.rank || ""}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      rank: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Rank"
                />
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createFormData.isEnabled}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          isEnabled: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enabled
                    </span>
                  </label>

                  {/* <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createFormData.isService}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          isService: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Service
                    </span>
                  </label> */}

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createFormData.isPriceChangeAllowed}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          isPriceChangeAllowed: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Price Change Allowed
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createFormData.isTaxInclusive}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          isTaxInclusive: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Tax Inclusive
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createFormData.usesDefaultQuantity}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          usesDefaultQuantity: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Uses Default Quantity
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={createLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateProduct}
                disabled={createLoading}
              >
                {createLoading ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
