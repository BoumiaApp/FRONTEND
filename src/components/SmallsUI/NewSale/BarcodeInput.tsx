import { useState, useEffect } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import ComponentCard from "../../common/ComponentCard";
import { productAPI } from "../../../services/productApi";
import { Product } from "../../../types/product";

export default function BarcodeInput({
  setProducts,
}: {
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [searchItem, setSearchItem] = useState("");
  const [error, setError] = useState(false);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = (await productAPI.getAllProducts()).data;
        setProducts(response.splice(0, 12)); // Limit to first 10 products
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(true);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSearchItemChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchItem(value);

    let response: Product[] = [];
    if (value === "") {
      response = (await productAPI.getAllProducts()).data;
      setProducts(response.splice(0, 12)); // Limit to first 10 products
    } else {
      response = (await productAPI.searchProductsGeneral(value)).data;
      console.log(response);
      if (response.length <= 0) {
        setError(true);
      } else {
        setError(false);
      }
      setProducts(response.splice(0, 12)); // Limit to first 10 products  
    }
  };

  return (
    <ComponentCard
      title="Search Products"
    >
      <div className="space-y-5 sm:space-y-6">
        {/* Error Input */}
        <div>
          <Label>Search Products</Label>
          <Input
            type="text"
            value={searchItem}
            error={error}
            success={!error}
            onChange={handleSearchItemChange}
            placeholder="Enter your Query"
            hint={error ? "There is no product with this search value" : ""}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
