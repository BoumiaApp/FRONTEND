import React from "react";
import { Product } from "../../../types/product";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      onClick={() => onClick(product)}
      className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer transition duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {/* Product Name */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {product.name}
      </h3>

      {/* Product Group */}
      {/* <p className="text-sm text-gray-500 dark:text-gray-400">{product.productGroupName}</p> */}

      {/* Price */}
      <p className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-200">
        {product.price} DH
      </p>

      {/* Optional Color */}
      {product.color && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Color: {product.color}
        </p>
      )}
    </div>
  );
};

export default ProductCard;