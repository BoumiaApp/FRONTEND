import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import PageMeta from "../common/PageMeta";
import BasicTableOne from "../tables/UsersTables";
import Button from "../ui/button/Button";
import { BoxIcon } from "../../icons";
import ProductsTables from "../tables/ProductsTables";

export default function Products() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          <div className="flex justify-between items-center">
            <div></div>
            <Button
              size="sm"
              variant="primary"
              startIcon={<BoxIcon className="size-7" />}
            >
              Ajouter vendeur{" "}
            </Button>
          </div>
          <ProductsTables />
        </ComponentCard>
      </div>
    </>
  );
}
