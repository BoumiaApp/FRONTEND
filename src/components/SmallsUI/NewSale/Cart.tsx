import React, { useEffect, useState } from "react";
import { Product } from "../../../types/product";
import { Customer } from "../../../types/customer";
import { customerAPI } from "../../../services/customerApi";

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  discount: number;
  discountType: "fixed" | "percent";
}

interface CartProps {
  items: CartItem[];
  onRemove: (productId: number) => void;
  onUpdateItem: (productId: number, field: string, value: any) => void;
  onConfirm: (customerId: number) => void;
  onSaveForLater: (customerId: number) => void;
  onCancel: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onRemove,
  onUpdateItem,
  onConfirm,
  onSaveForLater,
  onCancel,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [orderDiscountType, setOrderDiscountType] = useState<"fixed" | "percent">("fixed");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerAPI.getAllCustomers(); // call your API function
        const data: Customer[] = response.data;
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const calculateItemTotal = (item: CartItem) => {
    let total = item.price * item.quantity;
    if (item.discountType === "fixed") {
      total -= item.discount;
    } else {
      total -= (total * item.discount) / 100;
    }
    return total;
  };

  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const total =
    orderDiscountType === "fixed"
      ? subtotal - orderDiscount
      : subtotal - (subtotal * orderDiscount) / 100;

  return (
    <div className="p-4 rounded-lg bg-white shadow-md dark:bg-gray-800 flex flex-col gap-4">
      <h2 className="text-lg font-bold dark:text-white">Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No products in cart</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col gap-2 border-b pb-3 dark:border-gray-700"
              >
                {/* Product Row */}
                <div className="flex justify-between items-center">
                  <p className="font-medium dark:text-gray-200">{item.product.name}</p>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded dark:bg-red-600"
                    onClick={() => onRemove(item.product.id)}
                  >
                    ✕
                  </button>
                </div>

                {/* Editable Fields */}
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <input
                    type="number"
                    value={item.price}
                    disabled={!item.product.isPriceChangeAllowed}
                    className={`w-20 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white ${
                      !item.product.isPriceChangeAllowed ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onChange={(e) =>
                      onUpdateItem(item.product.id, "price", parseFloat(e.target.value))
                    }
                    min={0}
                    step={0.01}
                  />
                  <span className="dark:text-gray-300">DH ×</span>
                  <input
                    type="number"
                    value={item.quantity}
                    className="w-16 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
                    onChange={(e) =>
                      onUpdateItem(item.product.id, "quantity", parseInt(e.target.value))
                    }
                    min={1}
                  />
                  <input
                    type="number"
                    placeholder="Discount"
                    value={item.discount}
                    className="w-20 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
                    onChange={(e) =>
                      onUpdateItem(item.product.id, "discount", parseFloat(e.target.value))
                    }
                    min={0}
                    step={0.01}
                  />
                  <select
                    value={item.discountType}
                    className="px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
                    onChange={(e) =>
                      onUpdateItem(item.product.id, "discountType", e.target.value)
                    }
                  >
                    <option value="fixed">DH</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Order-level Discount */}
          <div className="flex gap-2 items-center mt-4">
            <input
              type="number"
              value={orderDiscount}
              className="w-24 px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
              onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
              placeholder="Order Discount"
              min={0}
              step={0.01}
            />
            <select
              value={orderDiscountType}
              className="px-2 py-1 rounded border dark:bg-gray-700 dark:text-white"
              onChange={(e) =>
                setOrderDiscountType(e.target.value as "fixed" | "percent")
              }
            >
              <option value="fixed">DH</option>
              <option value="percent">%</option>
            </select>
          </div>

          {/* Totals */}
          <div className="flex justify-between font-semibold text-lg mt-2 dark:text-gray-200">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} DH</span>
          </div>
          <div className="flex justify-between font-semibold text-lg dark:text-gray-200">
            <span>Total:</span>
            <span>{total.toFixed(2)} DH</span>
          </div>

          {/* Customer Selector */}
          <div className="mt-3">
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">
              Select Customer
            </label>
            <select
              value={selectedCustomer ?? ""}
              className="w-full px-2 py-2 rounded border dark:bg-gray-700 dark:text-white"
              onChange={(e) => setSelectedCustomer(Number(e.target.value))}
            >
              <option value="">-- Choose --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => selectedCustomer && onConfirm(selectedCustomer)}
              disabled={!selectedCustomer}
            >
              Confirm Order
            </button>
            <button
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded"
              onClick={() => selectedCustomer && onSaveForLater(selectedCustomer)}
              disabled={!selectedCustomer}
            >
              Save for Later
            </button>
            <button
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
