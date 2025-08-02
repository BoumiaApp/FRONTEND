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

interface Customer {
  id: number;
  code: string | null;
  name: string;
  taxNumber?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isEnabled: boolean;
  isCustomer: boolean;
  isSupplier: boolean;
  city?: string | null;
  countryId?: number | null;
  dateCreated: string;
  dateUpdated: string;
}

const customers: Customer[] = [
  {
    id: 1,
    code: "CUST001",
    name: "Lindsey Curtis",
    taxNumber: "TX001",
    email: "lindsey@example.com",
    phoneNumber: "+123456789",
    isEnabled: true,
    isCustomer: true,
    isSupplier: false,
    city: "New York",
    countryId: 1,
    dateCreated: "2024-01-01",
    dateUpdated: "2024-06-01",
  },
  {
    id: 2,
    code: "CUST002",
    name: "Kaiya George",
    taxNumber: null,
    email: "kaiya@example.com",
    phoneNumber: "+987654321",
    isEnabled: false,
    isCustomer: true,
    isSupplier: true,
    city: "Los Angeles",
    countryId: 2,
    dateCreated: "2024-02-15",
    dateUpdated: "2024-05-15",
  },
];

export default function ClientsTables() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.02]">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {[
                "Name",
                "Code",
                "Email",
                "Phone",
                "City",
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
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
              >
                <TableCell className="px-5 py-4 text-left text-gray-800 dark:text-white">
                  {customer.name}
                </TableCell>

                <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                  {customer.code || "-"}
                </TableCell>

                <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                  {customer.email || "-"}
                </TableCell>

                <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                  {customer.phoneNumber || "-"}
                </TableCell>

                <TableCell className="px-5 py-4 text-left text-gray-700 dark:text-gray-300">
                  {customer.city || "-"}
                </TableCell>

                <TableCell className="px-5 py-4 text-left">
                  <Badge
                    size="sm"
                    color={customer.isEnabled ? "success" : "error"}
                  >
                    {customer.isEnabled ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>

                <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm">
                  {customer.dateCreated}
                </TableCell>

                <TableCell className="px-5 py-4 text-left text-gray-500 dark:text-gray-400 text-sm">
                  {customer.dateUpdated}
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
  );
}
