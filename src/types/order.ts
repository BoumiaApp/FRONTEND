// Customer type (based on your CustomerDto)
export interface Customer {
    id: number;
    code: string;
    name: string;
    taxNumber: string;
    address: string;
    postalCode: string;
    city: string;
    dateCreated: string;  // ISO string datetime
    dateUpdated: string;
    email: string;
    phoneNumber: string | null;
    isEnabled: boolean;
    isCustomer: boolean;
    isSupplier: boolean;
    dueDatePeriod: number;
    streetName: string | null;
    additionalStreetName: string | null;
    buildingNumber: string | null;
    plotIdentification: string | null;
    citySubdivisionName: string | null;
    countrySubentity: string;
    isTaxExempt: boolean;
  }
  
  // Order Item type
  export interface PosOrderItem {
    id: number;
    productId: number;
    quantity: number;    // or string if you want to handle decimals as strings
    price: number;
    discount: number;
    discountType: 0 | 1;  // 0 = fixed, 1 = percentage
    comment: string | null;
    locked?: boolean | null;  // optional, because your example shows null
  }
  
  // Order type
  export interface PosOrder {
    id: number;
    userName: string;
    number: string;
    discount: number;
    discountType: number;   // 0 = fixed, 1 = percentage
    total: number;
    status: string;
    dateCreated: string;    // ISO datetime string
    dateUpdated: string;
    customer: Customer;
    items: PosOrderItem[];
  }
  
  /// Order creation API Payloads
  export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
    discount: number;
    discountType: 0 | 1; // 0 = fixed, 1 = percent
    comment?: string;
  }
  
  export interface CreateOrderPayload {
    customerId: number;
    userId: number;
    discount: number;
    discountType: 0 | 1; // 0 = fixed, 1 = percent
    status: "PENDING" | "DONE" | string;
    items: OrderItem[];
  }
  