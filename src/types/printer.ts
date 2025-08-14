import { PosOrder } from "./order";

// types/printer.ts
export interface PrinterDevice {
    device: USBDevice | null;
    connected: boolean;
  }
  
  export interface ThermalPrinterHook {
    printer: PrinterDevice;
    connect: () => Promise<void>;
    print: (order: PosOrder) => Promise<void>;
    isSupported: boolean;
  }
  
  export interface USBDeviceRequestOptions {
    vendorId?: number;
    productId?: number;
  }
  
  // Extend Window and Navigator interfaces
  declare global {
    interface Navigator {
      usb?: {
        getDevices(): Promise<USBDevice[]>;
        requestDevice(options: { filters: USBDeviceRequestOptions[] }): Promise<USBDevice>;
      };
    }
  
    interface USBDevice {
      open(): Promise<void>;
      close(): Promise<void>;
      selectConfiguration(configurationValue: number): Promise<void>;
      claimInterface(interfaceNumber: number): Promise<void>;
      transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    }
  
    interface USBOutTransferResult {
      bytesWritten: number;
      status: string;
    }
  }