import { useState } from "react";
import { Product } from "../../types/product";
import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";
import BarcodeInput from "../SmallsUI/NewSale/BarcodeInput";
import ProductCard from "../SmallsUI/NewSale/ProductCard";

export default function NewSale() {
  const [products, setProducts] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
    // TODO: Add to cart state
  };

  return (
    <div>
      <PageMeta title="NewSale" description="POS Sales Page" />
      <PageBreadcrumb pageTitle="NewSale" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Side */}
        <div className="space-y-6">
          <BarcodeInput setProducts={setProducts} />

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleAddToCart}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="space-y-6 bg-red-400">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                A demain Inshlh</h2>
          {/* TODO: Cart will be implemented here */}
        </div>
      </div>
    </div>
  );
}
