import { useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import ComponentCard from "../../common/ComponentCard";
import { productAPI } from "../../../services/productApi";

export default function BarcodeInput({
  setProducts,
}: {
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [searchItem, setSearchItem] = useState("");
  const [error, setError] = useState(false);

  const handleSearchItemChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchItem(value);
    let response = await productAPI.searchProductsGeneral(value);
    console.log(response.data);
    if (response.data.length <= 0) {
      setError(true);
    } else {
      setError(false);
    }
    setProducts(response.data);
  };

  return (
    <ComponentCard
      title="Input States"
      desc="Validation styles for error, success and disabled states on form controls."
    >
      <div className="space-y-5 sm:space-y-6">
        {/* Error Input */}
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={searchItem}
            error={error}
            success={!error}
            onChange={handleSearchItemChange}
            placeholder="Enter your Query"
            hint={error ? "There is no product with this serach value" : ""}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
