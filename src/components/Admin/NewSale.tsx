import { useState } from "react";
import { Product } from "../../types/product";
import { CartItem } from "../SmallsUI/NewSale/Cart";
import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";
import BarcodeInput from "../SmallsUI/NewSale/BarcodeInput";
import ProductCard from "../SmallsUI/NewSale/ProductCard";
import Cart from "../SmallsUI/NewSale/Cart";
import { orderAPI } from "../../services/orderApi";
import { CreateOrderPayload } from "../../types/order";

// Replace with actual user id from your auth/session
const CURRENT_USER_ID = 1;

export default function NewSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add product to cart or increment quantity
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
      return [
        ...prev,
        {
          product,
          quantity: 1,
          price: product.price,
          discount: 0,
          discountType: "fixed",
        },
      ];
    });
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Update field in cart item (price, quantity, discount, discountType)
  const handleUpdateItem = (productId: number, field: string, value: any) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // Confirm order: reformulate payload as per API and send
  const handleConfirm = async (
    customerId: number,
    orderDiscount: number,
    orderDiscountType: "fixed" | "percent",
    itemComments: Record<number, string>
  ) => {
    // Explicitly tell TS this is of type 0 | 1
    const discountTypeNum = (orderDiscountType === "fixed" ? 0 : 1) as 0 | 1;
  
    const orderPayload: CreateOrderPayload = {
      customerId,
      userId: CURRENT_USER_ID,
      discount: orderDiscount,
      discountType: discountTypeNum,
      status: "DONE",
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        // Also assert this here explicitly
        discountType: (item.discountType === "fixed" ? 0 : 1) as 0 | 1,
        comment: itemComments[item.product.id] || "",
      })),
    };
  
    try {
      console.log("Sending order payload:", orderPayload);
      await orderAPI.createOrder(orderPayload);
      alert("Order confirmed!");
      setCart([]);
    } catch (error: any) {
      console.error("Failed to confirm order:", error.response?.data || error);
      alert("Failed to confirm order. Try again.");
    }
  };
  
  
  const handleSaveForLater = async (customerId: number) => {
    const orderPayload: CreateOrderPayload = {
      customerId,
      userId: CURRENT_USER_ID,
      discount: 0,
      discountType: 0 as 0 | 1, // fixed discount type
      status: "PENDING", // Save for later has PENDING status
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        discountType: (item.discountType === "fixed" ? 0 : 1) as 0 | 1,
        comment: "", // You can customize comments here if needed
      })),
    };
  
    try {
      console.log("Saving order for later:", orderPayload);
      await orderAPI.createOrder(orderPayload); // Uncomment to call API
      alert("Order saved for later.");
    } catch (error: any) {
      console.error("Failed to save order:", error.response?.data || error);
      alert("Failed to save order. Try again.");
    }
  };
  
  

  const handleCancel = () => {
    setCart([]);
  };

  return (
    <div>
      <PageMeta title="NewSale" description="POS Sales Page" />
      <PageBreadcrumb pageTitle="NewSale" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Side */}
        <div className="space-y-6">
          <BarcodeInput products={products} setProducts={setProducts} handleAddToCart={handleAddToCart} />

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
            onUpdateItem={handleUpdateItem}
            onConfirm={handleConfirm}
            onSaveForLater={handleSaveForLater}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
