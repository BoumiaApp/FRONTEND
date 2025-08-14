import { useState, useEffect } from "react";
import Input from "../../form/input/InputField";
import ComponentCard from "../../common/ComponentCard";
import { productAPI } from "../../../services/productApi";
import { Product } from "../../../types/product";
import { useDebounce } from "../../../hooks/useDebounce"; // adjust path

export default function BarcodeInput({
  products,
  setProducts,
  handleAddToCart,
}: {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddToCart: (product: Product ) => void;
}) {
  const [searchItem, setSearchItem] = useState("");
  const [error, setError] = useState(false);

  const debouncedSearchItem = useDebounce(searchItem, 400); // 400ms debounce

  // Fetch all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = (await productAPI.getAllProducts()).data;
        setProducts(response.slice(0, 12));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(true);
      }
    };
    fetchAllProducts();
  }, []);

  // Trigger search only when debouncedSearchItem changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let result: Product[] = [];

        if (debouncedSearchItem === "") {
          result = (await productAPI.getAllProducts()).data;
        } else {
          result = (await productAPI.searchProductsGeneral(debouncedSearchItem)).data;
          setError(result.length <= 0);
        }

        setProducts(result.slice(0, 12));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(true);
      }
    };

    fetchProducts();
  }, [debouncedSearchItem]);

  // Handles pressing Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && products.length === 1) {
      handleAddToCart(products[0]);
      setSearchItem("");
      setProducts([]);
    }
  };

  return (
    <ComponentCard title="Search Products">
      <div className="space-y-5 sm:space-y-6">
        <div>
          <Input
            type="text"
            value={searchItem}
            error={error}
            success={!error}
            onChange={(e) => setSearchItem(e.target.value)}
            placeholder="Enter your Query"
            hint={error ? "There is no product with this search value" : ""}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
