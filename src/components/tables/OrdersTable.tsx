import  { useState } from "react";
import { Pencil, Printer, Eye, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Product, UpdateProductRequest } from "../../types/product";

import { PosOrder } from "../../types/order";
import { BoxIcon } from "../../icons";
import { useThermalPrinter } from "../../hooks/useThermalPrinter";

interface OrdersTableProps {
  orders: PosOrder[];
  loading: boolean;
  onDeleteOrder: (productId: number) => Promise<void>;
  // onToggleProductStatus: (
  //   productId: number,
  //   currentStatus: boolean
  // ) => Promise<void>;
  // onUpdateProduct: (productId: number, updatedProduct: Product) => void;
}

export default function OrdersTable({
  orders,
  loading,
  onDeleteOrder,

}: OrdersTableProps) {
  // Inside your component
  const { printer, connect, print, isSupported } = useThermalPrinter();

  // Print Thermal button implementation
  const handlePrint = async (order: PosOrder) => {
    try {
      if (!printer.connected) {
        await connect();
      }
      await print(order);
      alert("Receipt printed successfully!");
    } catch (error) {
      console.error("Print error:", error);
      alert(
        `Print failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
  const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateProductRequest>({
    code: "",
    barcode: "",
    name: "",
    description: "",
    productGroupId: undefined,
    price: 0,
    cost: 0,
    isEnabled: true,
    isService: false,
    isPriceChangeAllowed: true,
    isTaxInclusive: false,
    usesDefaultQuantity: false,
    rank: 0,
    quantity: 0, // Optional for stock management
  });
  // const [editLoading, setEditLoading] = useState(false);
  // const [editError, setEditError] = useState("d");
  // const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);

  const handleViewDetails = (order: PosOrder) => {
    setSelectedOrder(order);
    setShowTicketModal(true);
  };

  // useEffect(() => {
  //   fetchProductGroups();
  // }, []);

  // const fetchProductGroups = async () => {
  //   try {
  //     const response = await productGroupAPI.getAllProductGroups();
  //     setProductGroups(response.data);
  //   } catch (error) {
  //     console.error("Error fetching product groups:", error);
  //   }
  // };

  // const handleEditProduct = (product: Product) => {
  //   setEditingProduct(product);
  //   setEditFormData({
  //     code: product.code || "",
  //     barcode: product.barcode || "",
  //     name: product.name,
  //     description: product.description || "",
  //     productGroupId: product.productGroupId,
  //     price: product.price,
  //     cost: product.cost || 0,
  //     isEnabled: product.isEnabled,
  //     isService: product.isService,
  //     isPriceChangeAllowed: product.isPriceChangeAllowed,
  //     isTaxInclusive: product.isTaxInclusive,
  //     usesDefaultQuantity: product.usesDefaultQuantity,
  //     rank: product.rank || 0,
  //     quantity: product.quantity || 0, // Optional for stock management
  //   });
  //   setEditError("");
  //   console.log(products);
  // };

  // const handleUpdateProduct = async () => {
  //   if (!editingProduct || !editFormData.name) {
  //     setEditError("Name is required field");
  //     return;
  //   }

  //   try {
  //     setEditLoading(true);
  //     setEditError("");

  //     const response = await productAPI.updateProduct(
  //       editingProduct.id,
  //       editFormData
  //     );

  //     // Update the product in the parent component
  //     const updatedProduct = response.data;
  //     onUpdateProduct(editingProduct.id, updatedProduct);

  //     setEditingProduct(null);
  //     setEditFormData({
  //       code: "",
  //       barcode: "",
  //       name: "",
  //       description: "",
  //       productGroupId: undefined,
  //       price: 0,
  //       cost: 0,
  //       isEnabled: true,
  //       isService: false,
  //       isPriceChangeAllowed: true,
  //       isTaxInclusive: false,
  //       usesDefaultQuantity: false,
  //       rank: 0,
  //     });
  //   } catch (error: any) {
  //     console.error("Error updating product:", error);
  //     setEditError(error.response?.data?.message || "Failed to update product");
  //   } finally {
  //     setEditLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No orders found
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
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Client/Num Order
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  GSM/CODE
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Price/Dis
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Cahier{" "}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Quantity
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
                >
                  {/* Customer Name & Order Number */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <BoxIcon className="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.customer?.name || "Unknown Customer"}
                        </div>
                        {order.number && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {order.number}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Customer Phone & Code */}
                  <TableCell className="px-5 py-4">
                    <div className="space-y-1">
                      {order.customer?.phoneNumber && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">GSM:</span>{" "}
                          {order.customer.phoneNumber}
                        </div>
                      )}
                      {order.customer?.code && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Code:</span>{" "}
                          {order.customer.code}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.total.toFixed(2)} DH
                      </div>
                      {Number(order.discount) > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Discount: {order.discount}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.userName || "Unknown Customer"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {/* Status */}
                  <TableCell className="px-5 py-4">
                    <Badge
                      size="sm"
                      color={
                        order.status?.toLowerCase() === "pending"
                          ? "warning"
                          : order.status?.toLowerCase() === "completed"
                          ? "success"
                          : "primary"
                      }
                    >
                      {order.status || "Unknown"}
                    </Badge>
                  </TableCell>

                  {/* Quantity: total items count */}
                  <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">
                    {order.items?.length || 0}
                  </TableCell>

                  {/* Actions: Only icons, no text */}
                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Edit order"
                        className="flex items-center gap-1"
                        // onClick={() => handleEditOrder(order.id)}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Print ticket"
                        className="flex items-center gap-1"
                      onClick={() => handlePrint(order)}
                      disabled={!isSupported}

                      >
                        <Printer className="size-4" />
                        {printer.connected ? 'Print Thermal' : 'Connect & Print'}

                        
                      </Button>



                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="View details"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="size-4" />
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Delete order"
                        className="flex items-center gap-1 text-red-500 hover:text-red-700"
                        onClick={() => onDeleteOrder(order.id)}
                      >
                        <Trash2 className="size-4" />
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Product
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <BoxIcon className="size-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  value={editFormData.code}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, code: e.target.value })
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
                  value={editFormData.barcode || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
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
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 bg-white"
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Group
                </label>
                <select
                  value={editFormData.productGroupId || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                  value={editFormData.cost}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                  value={editFormData.quantity || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                  value={editFormData.rank || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
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
                      checked={editFormData.isEnabled}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isEnabled: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enabled
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isService}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isService: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Service
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.isPriceChangeAllowed}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
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
                      checked={editFormData.isTaxInclusive}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
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
                      checked={editFormData.usesDefaultQuantity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
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

            {/* {editError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {editError}
              </div>
            )} */}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingProduct(null)}
                // disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                // onClick={handleUpdateProduct}
                // disabled={editLoading}
              >
                Edit
                {/* {editLoading ? "Updating..." : "Update Product"} */}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Order Ticket Modal */}
      {/* Order Ticket Modal */}
      {showTicketModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Main content - non-printable */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Printable content */}
            <div
              id="printable-ticket"
              className="w-full bg-white p-4 print:p-0"
            >
              {/* A4 Styled Ticket */}
              <div className="hidden print:block a4-ticket">
                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600">
                      BOUMIA
                    </div>
                    <div className="text-lg text-gray-600">Order Receipt</div>
                    <div className="text-sm text-gray-500 mt-2 border-t border-b border-gray-200 py-2">
                      {new Date(selectedOrder.dateCreated).toLocaleString()}
                    </div>
                  </div>

                  {/* Order info */}
                  <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg  ">
                      <div className="font-semibold text-gray-700">Order #</div>
                      <div>{selectedOrder.number}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-700">Cashier</div>
                      <div>{selectedOrder.userName}</div>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <div className="font-semibold text-blue-700 mb-2">
                      Customer Information
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Name</div>
                        <div className="font-medium">
                          {selectedOrder.customer?.name || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Code</div>
                        <div className="font-medium">
                          {selectedOrder.customer?.code || "N/A"}
                        </div>
                      </div>
                      {selectedOrder.customer?.phoneNumber && (
                        <div>
                          <div className="text-sm text-gray-600">Phone</div>
                          <div className="font-medium">
                            {selectedOrder.customer.phoneNumber}
                          </div>
                        </div>
                      )}
                      {selectedOrder.customer?.email && (
                        <div>
                          <div className="text-sm text-gray-600">Email</div>
                          <div className="font-medium">
                            {selectedOrder.customer.email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="mb-6">
                    <div className="font-semibold text-lg mb-3 text-gray-700">
                      Order Items
                    </div>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="p-3 border-b border-gray-200">
                            Product
                          </th>
                          <th className="p-3 border-b border-gray-200 text-right">
                            Qty
                          </th>
                          <th className="p-3 border-b border-gray-200 text-right">
                            Price
                          </th>
                          <th className="p-3 border-b border-gray-200 text-right">
                            Discount
                          </th>
                          <th className="p-3 border-b border-gray-200 text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => {
                          const itemTotal = item.price * item.quantity;
                          const itemDiscount =
                            item.discountType === 0
                              ? item.discount
                              : (itemTotal * item.discount) / 100;
                          const itemFinalPrice = itemTotal - itemDiscount;

                          return (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <div className="font-medium">
                                  {item.productName}
                                </div>
                                {item.comment && (
                                  <div className="text-xs text-gray-500 italic">
                                    Note: {item.comment}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                {item.quantity}
                              </td>
                              <td className="p-3 text-right">
                                {item.price.toFixed(2)} DH
                              </td>
                              <td className="p-3 text-right text-red-500">
                                {item.discount > 0
                                  ? item.discountType === 0
                                    ? `-${item.discount.toFixed(2)} DH`
                                    : `-${item.discount}%`
                                  : "-"}
                              </td>
                              <td className="p-3 text-right font-medium">
                                {itemFinalPrice.toFixed(2)} DH
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-medium">
                        {selectedOrder.items
                          ?.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}{" "}
                        DH
                      </span>
                    </div>

                    {selectedOrder.items?.some((item) => item.discount > 0) && (
                      <div className="mb-3">
                        <div className="font-medium text-sm mb-1">
                          Item Discounts:
                        </div>
                        {selectedOrder.items?.map((item, index) => {
                          if (item.discount <= 0) return null;
                          const discountAmount =
                            item.discountType === 0
                              ? item.discount * item.quantity
                              : (item.price * item.quantity * item.discount) /
                                100;
                          return (
                            <div
                              key={index}
                              className="flex justify-between text-sm text-red-500"
                            >
                              <span className="pl-4">
                                {item.productName} (
                                {item.discountType === 0
                                  ? `${item.discount.toFixed(2)} DH`
                                  : `${item.discount}%`}
                                )
                              </span>
                              <span>-{discountAmount.toFixed(2)} DH</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-red-500 mb-2">
                        <span className="font-medium">
                          Order Discount (
                          {selectedOrder.discountType === 0
                            ? "Fixed"
                            : "Percentage"}
                          ):
                        </span>
                        <span className="font-medium">
                          -
                          {selectedOrder.discountType === 0
                            ? `${selectedOrder.discount.toFixed(2)} DH`
                            : `${selectedOrder.discount}%`}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xl font-bold mt-4 pt-3 border-t border-gray-200">
                      <span>TOTAL:</span>
                      <span className="text-blue-600">
                        {selectedOrder.total.toFixed(2)} DH
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                    <div>Thank you for your purchase!</div>
                    <div className="mt-1">
                      BOUMIA - {window.location.hostname}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thermal Printer Ticket (visible only when printing) */}
              <div className="print:hidden thermal-ticket">
                <div className="text-center">
                  <div className="font-bold">BOUMIA</div>
                  <div>Order Receipt</div>
                  <div className="text-xs border-t border-b py-1 my-1">
                    {new Date(selectedOrder.dateCreated).toLocaleString()}
                  </div>
                </div>

                <div className="text-xs mb-1">
                  <div>
                    <span className="font-semibold">Order:</span>{" "}
                    {selectedOrder.number}
                  </div>
                  <div>
                    <span className="font-semibold">Cashier:</span>{" "}
                    {selectedOrder.userName}
                  </div>
                </div>

                <div className="border-t border-b py-1 my-1 text-xs">
                  <div className="font-semibold">Customer:</div>
                  <div>
                    {selectedOrder.customer?.name || "N/A"} (
                    {selectedOrder.customer?.code || "N/A"})
                  </div>
                  {selectedOrder.customer?.phoneNumber && (
                    <div>Tel: {selectedOrder.customer.phoneNumber}</div>
                  )}
                </div>

                <div className="text-xs">
                  <div className="font-semibold border-b pb-1 mb-1">ITEMS:</div>
                  {selectedOrder.items?.map((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    const itemDiscount =
                      item.discountType === 0
                        ? item.discount * item.quantity
                        : (item.price * item.quantity * item.discount) / 100;
                    const itemFinalPrice = itemTotal - itemDiscount;

                    return (
                      <div key={index} className="mb-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {item.productName}
                          </span>
                          <span>{itemFinalPrice.toFixed(2)} DH</span>
                        </div>
                        <div className="flex justify-between text-2xs">
                          <span>
                            {item.quantity} x {item.price.toFixed(2)} DH
                            {item.discount > 0 && (
                              <span className="text-red-500">
                                {" "}
                                (Disc:{" "}
                                {item.discountType === 0
                                  ? `${item.discount.toFixed(2)} DH`
                                  : `${item.discount}%`}
                                )
                              </span>
                            )}
                          </span>
                          <span>{itemTotal.toFixed(2)} DH</span>
                        </div>
                        {item.comment && (
                          <div className="text-2xs italic">
                            Note: {item.comment}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t mt-2 pt-1 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {selectedOrder.items
                        ?.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}{" "}
                      DH
                    </span>
                  </div>

                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>
                        Order Disc (
                        {selectedOrder.discountType === 0 ? "Fixed" : "%"}):
                      </span>
                      <span>
                        -
                        {selectedOrder.discountType === 0
                          ? `${selectedOrder.discount.toFixed(2)} DH`
                          : `${selectedOrder.discount}%`}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold mt-1">
                    <span>TOTAL:</span>
                    <span>{selectedOrder.total.toFixed(2)} DH</span>
                  </div>
                </div>

                <div className="text-center text-2xs mt-3">
                  <div>Thank you for your purchase!</div>
                  <div>BOUMIA - {window.location.hostname}</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowTicketModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex items-center gap-1"
                onClick={() => {
                  // // Print A4 version
                  // const printContent =
                  //   document.getElementById("printable-ticket")?.innerHTML;
                  const printWindow = window.open("", "_blank");
                  printWindow?.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Ticket - ${selectedOrder.number}</title>
          <style>
            @page { 
              size: A4; 
              margin: 1.5cm;
              @top-center {
                content: "BOUMIA Order Receipt";
                font-size: 14px;
                color: #555;
              }
              @bottom-center {
                content: "Page " counter(page);
                font-size: 12px;
                color: #777;
              }
            }
            
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0; 
              padding: 0; 
              color: #333;
              line-height: 1.5;
            }
            
            .header {
              text-align: center;
              margin-bottom: 1.5rem;
            }
            
            .company-name {
              font-size: 28px;
              font-weight: 700;
              color: #1e40af;
              margin-bottom: 0.5rem;
            }
            
            .document-title {
              font-size: 18px;
              color: #4b5563;
              margin-bottom: 1rem;
            }
            
            .order-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem;
              margin-bottom: 1.5rem;
            }
            
            .info-card {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px;
            }
            
            .info-card h3 {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 6px;
            }
            
            .info-card p {
              font-size: 15px;
              font-weight: 500;
              color: #1e293b;
              margin: 0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.5rem 0;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            thead {
              background-color: #1e40af;
              color: white;
            }
            
            th {
              padding: 12px 15px;
              text-align: left;
              font-weight: 600;
              border-right: 1px solid rgba(255,255,255,0.1);
            }
            
            th:last-child {
              border-right: none;
            }
            
            td {
              padding: 10px 15px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            
            tr:hover {
              background-color: #f1f5f9;
            }
            
            .product-name {
              font-weight: 500;
              color: #1e293b;
            }
            
            .product-note {
              font-size: 12px;
              color: #64748b;
              font-style: italic;
              margin-top: 4px;
            }
            
            .text-right {
              text-align: right;
            }
            
            .text-center {
              text-align: center;
            }
            
            .discount {
              color: #dc2626;
              font-weight: 500;
            }
            
            .summary {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 1.5rem;
              margin-top: 1.5rem;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            
            .total-row {
              font-size: 18px;
              font-weight: 700;
              color: #1e40af;
              padding-top: 12px;
              border-top: 2px solid #e2e8f0;
              margin-top: 12px;
            }
            
            .footer {
              text-align: center;
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 13px;
            }
            
            .barcode {
              margin-top: 1rem;
              text-align: center;
              font-family: 'Libre Barcode 128', cursive;
              font-size: 36px;
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="header">
            <div class="company-name">BOUMIA</div>
            <div class="document-title">Order Receipt</div>
            <div class="text-sm text-gray-500">
              ${new Date(selectedOrder.dateCreated).toLocaleString()}
            </div>
          </div>
          
          <div class="order-info">
            <div class="info-card">
              <h3>ORDER INFORMATION</h3>
              <p><strong>Order #:</strong> ${selectedOrder.number}</p>
              <p><strong>Status:</strong> ${selectedOrder.status}</p>
              <p><strong>Cashier:</strong> ${selectedOrder.userName}</p>
            </div>
            
            <div class="info-card">
              <h3>CUSTOMER INFORMATION</h3>
              <p><strong>Name:</strong> ${
                selectedOrder.customer?.name || "N/A"
              }</p>
              <p><strong>Code:</strong> ${
                selectedOrder.customer?.code || "N/A"
              }</p>
              ${
                selectedOrder.customer?.phoneNumber
                  ? `<p><strong>Phone:</strong> ${selectedOrder.customer.phoneNumber}</p>`
                  : ""
              }
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Discount</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrder.items
                ?.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const itemDiscount =
                    item.discountType === 0
                      ? item.discount * item.quantity
                      : (item.price * item.quantity * item.discount) / 100;
                  const itemFinalPrice = itemTotal - itemDiscount;

                  return `
                  <tr>
                    <td>
                      <div class="product-name">${item.productName}</div>
                      ${
                        item.comment
                          ? `<div class="product-note">Note: ${item.comment}</div>`
                          : ""
                      }
                    </td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${item.price.toFixed(2)} DH</td>
                    <td class="text-right discount">
                      ${
                        item.discount > 0
                          ? item.discountType === 0
                            ? `-${item.discount.toFixed(2)} DH`
                            : `-${item.discount}%`
                          : "-"
                      }
                    </td>
                    <td class="text-right">${itemFinalPrice.toFixed(2)} DH</td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${selectedOrder.items
                ?.reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)} DH</span>
            </div>
            
            ${
              selectedOrder.discount > 0
                ? `
              <div class="summary-row discount">
                <span>Order Discount (${
                  selectedOrder.discountType === 0 ? "Fixed" : "Percentage"
                }):</span>
                <span>-${
                  selectedOrder.discountType === 0
                    ? `${selectedOrder.discount.toFixed(2)} DH`
                    : `${selectedOrder.discount}%`
                }</span>
              </div>
            `
                : ""
            }
            
            <div class="summary-row total-row">
              <span>TOTAL:</span>
              <span>${selectedOrder.total.toFixed(2)} DH</span>
            </div>
          </div>
          
          <div class="footer">
            <div>Thank you for your business!</div>
            <div>BOUMIA - ${window.location.hostname}</div>
            <div class="barcode">*${selectedOrder.number}*</div>
          </div>
          
          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 500);
            }, 200);
          </script>
        </body>
      </html>
    `);
                  printWindow?.document.close();
                }}
              >
                <Printer className="size-4" />
                Print A4
              </Button>
              <Button
                variant="primary"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                onClick={() => selectedOrder && handlePrint(selectedOrder)}
                disabled={!isSupported}
              >
                <Printer className="size-4" />
                {printer.connected ? "Print Thermal" : "Connect & Print"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
