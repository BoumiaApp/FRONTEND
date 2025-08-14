// hooks/useThermalPrinter.ts
import { useState, useEffect } from 'react';

import { PrinterDevice, ThermalPrinterHook } from '../types/printer';
import { PosOrder } from '../types/order';
import { connectPrinter, isWebUSBSupported, printThermalReceipt } from '../helpers/ThermalPrinter';

export const useThermalPrinter = (): ThermalPrinterHook => {
  const [printer, setPrinter] = useState<PrinterDevice>({
    device: null,
    connected: false
  });

  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isWebUSBSupported());
    
    const checkPrinter = async () => {
      if (!isWebUSBSupported()) return;
      
      try {
        const devices = await navigator.usb!.getDevices();
        if (devices.length > 0) {
          await devices[0].open();
          setPrinter({
            device: devices[0],
            connected: true
          });
        }
      } catch (error) {
        console.log('No printer pre-connected');
      }
    };
    
    checkPrinter();
  }, []);

  const connect = async (): Promise<void> => {
    if (!isWebUSBSupported()) {
      throw new Error('WebUSB not supported');
    }
    try {
      const device = await connectPrinter();
      setPrinter({
        device,
        connected: true
      });
    } catch (error) {
      throw error;
    }
  };

  const print = async (order: PosOrder): Promise<void> => {
    if (!printer.connected || !printer.device) {
      throw new Error('Printer not connected');
    }
    return printThermalReceipt(order);
  };

  return {
    printer,
    connect,
    print,
    isSupported: supported
  };
};