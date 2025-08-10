import { useState } from "react";
import { Product } from "../../types/product";
import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";
import BarcodeInput from "../SmallsUI/NewSale/BarcodeInput";
import ProductCard from "../SmallsUI/NewSale/ProductCard";
import Cart from "../SmallsUI/NewSale/Cart";

export default function NewSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
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
        <div className="space-y-6">
          <Cart
            items={cart}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>
      </div>
    </div>
  );
}
