import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onStatusChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onStatusChange: (id: number, newStatus: string) => void;
}) {
  const [currentStatus, setCurrentStatus] = useState(order?.status);

  if (!order) return null;

  const handleConfirm = () => {
    setCurrentStatus("DONE");
    onStatusChange(order.id, "DONE");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                
                <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
                  Order Details — {order.number}
                </Dialog.Title>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p><span className="font-medium">User:</span> {order.userName}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-0.5 rounded text-white ${
                        currentStatus === "DONE" ? "bg-green-500" : "bg-yellow-500"
                      }`}>
                        {currentStatus}
                      </span>
                    </p>
                    <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Date Created:</span> {new Date(order.dateCreated).toLocaleString()}</p>
                    <p><span className="font-medium">Date Updated:</span> {new Date(order.dateUpdated).toLocaleString()}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-3 mb-4">
                  <h3 className="text-sm font-semibold mb-2">Customer</h3>
                  <p><span className="font-medium">Name:</span> {order.customer?.name}</p>
                  <p><span className="font-medium">Email:</span> {order.customer?.email}</p>
                  <p><span className="font-medium">Phone:</span> {order.customer?.phoneNumber}</p>
                  <p><span className="font-medium">City:</span> {order.customer?.city}</p>
                </div>

                {/* Items Table */}
                <div className="border-t pt-3">
                  <h3 className="text-sm font-semibold mb-2">Items</h3>
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Product ID</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Discount</th>
                        <th className="p-2 border">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: any) => (
                        <tr key={item.id} className="text-center">
                          <td className="p-2 border">{item.productId}</td>
                          <td className="p-2 border">{item.quantity}</td>
                          <td className="p-2 border">${item.price.toFixed(2)}</td>
                          <td className="p-2 border">${item.discount.toFixed(2)}</td>
                          <td className="p-2 border">{item.comment || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end space-x-2">
                  <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={onClose}>
                    Close
                  </button>
                  {currentStatus !== "DONE" && (
                    <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleConfirm}>
                      Confirm
                    </button>
                  )}
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
