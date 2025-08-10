import React from "react";
import { Product } from "../../../types/product";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    onRemove: (productId: number) => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQuantity }) => {
    const total = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );

    return (
        <div className="p-4 rounded-lg bg-white shadow-md dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Cart</h2>

            {items.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No products in cart</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex justify-between items-center border-b pb-2 dark:border-gray-700"
                        >
                            <div>
                                <p className="font-medium dark:text-gray-200">{item.product.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.product.price} DH
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className="px-2 py-1 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200"
                                    onClick={() =>
                                        onUpdateQuantity(item.product.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="dark:text-gray-200">{item.quantity}</span>
                                <button
                                    className="px-2 py-1 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200"
                                    onClick={() =>
                                        onUpdateQuantity(item.product.id, item.quantity + 1)
                                    }
                                >
                                    +
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded dark:bg-red-600"
                                    onClick={() => onRemove(item.product.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between font-semibold text-lg mt-4 dark:text-gray-200">
                        <span>Total:</span>
                        <span>{total.toFixed(2)} DH</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
