import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { BoxIcon } from "../../icons";
import Button from "../ui/button/Button";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  code?: string | null;
  barcode?: string | null;
  price: number;
  cost: number;
  margin: number;
  measurementUnit?: string | null;
  isEnabled: boolean;
  isService: boolean;
  description?: string | null;
  dateCreated: string;
  dateUpdated: string;
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Product A",
    code: "PRD001",
    barcode: "1234567890",
    price: 12.99,
    cost: 7.5,
    margin: 5.49,
    measurementUnit: "pcs",
    isEnabled: true,
    isService: false,
    description: "Standard product A",
    dateCreated: "2024-01-01",
    dateUpdated: "2024-06-01",
    quantity: 50,
  },
  {
    id: 2,
    name: "Service B",
    code: "SRV002",
    barcode: "9876543210",
    price: 49.99,
    cost: 0,
    margin: 49.99,
    measurementUnit: null,
    isEnabled: false,
    isService: true,
    description: "Consulting service",
    dateCreated: "2024-02-15",
    dateUpdated: "2024-06-20",
    quantity: 0,
  },
  {
    id: 3,
    name: "Product C",
    code: "PRD003",
    barcode: "1112223334",
    price: 24.5,
    cost: 15.0,
    margin: 9.5,
    measurementUnit: "pcs",
    isEnabled: true,
    isService: false,
    description: "High quality product C",
    dateCreated: "2024-03-10",
    dateUpdated: "2024-06-25",
    quantity: 120,
  },
  {
    id: 4,
    name: "Product D",
    code: "PRD004",
    barcode: "4445556667",
    price: 8.75,
    cost: 4.25,
    margin: 4.5,
    measurementUnit: "kg",
    isEnabled: true,
    isService: false,
    description: "Bulk item D sold by weight",
    dateCreated: "2024-03-20",
    dateUpdated: "2024-07-01",
    quantity: 300,
  },
  {
    id: 5,
    name: "Service E",
    code: "SRV005",
    barcode: "5558887771",
    price: 99.99,
    cost: 0,
    margin: 99.99,
    measurementUnit: null,
    isEnabled: true,
    isService: true,
    description: "Premium maintenance service",
    dateCreated: "2024-04-01",
    dateUpdated: "2024-07-10",
    quantity: 0,
  }
];


export default function ProductsTables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minQuantity, setMinQuantity] = useState<number | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.barcode && product.barcode.includes(searchTerm));

    const matchesQuantity =
      minQuantity === null || product.quantity >= minQuantity;

    return matchesSearch && matchesQuantity;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by name, code, or barcode"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-72 dark:bg-gray-900 dark:text-white dark:border-white/[0.1]"
        />
        <input
          type="number"
          placeholder="Min quantity"
          value={minQuantity ?? ""}
          onChange={(e) =>
            setMinQuantity(e.target.value ? parseInt(e.target.value) : null)
          }
          className="border rounded px-3 py-2 w-40 dark:bg-gray-900 dark:text-white dark:border-white/[0.1]"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Name",
                  "Code",
                  "Price",
                  "Cost",
                  "Margin",
                  "Quantity",
                  "Unit",
                  "Enabled",
                  "Created At",
                  "Updated At",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-semibold text-gray-600 text-left text-sm uppercase tracking-wide dark:text-gray-300"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
                >
                  <TableCell className="px-5 py-4 text-left text-gray-800 dark:text-white">
                    {product.name}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                    {product.code || "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                    ${product.price.toFixed(2)}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                    ${product.cost.toFixed(2)}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                    ${product.margin.toFixed(2)}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                    {product.quantity}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                    {product.measurementUnit || "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left">
                    <Badge
                      size="sm"
                      color={product.isEnabled ? "success" : "error"}
                    >
                      {product.isEnabled ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm">
                    {product.dateCreated}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm">
                    {product.dateUpdated}
                  </TableCell>

                  <TableCell className="px-5 py-4 flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <BoxIcon className="size-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <BoxIcon className="size-4" />
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
