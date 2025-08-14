// utils/thermalPrinter.ts
import { PosOrder } from "../types/order";

// Common ESC/POS commands
const ESC = '\x1B';
const GS = '\x1D';

export const thermalCommands = {
  INIT: ESC + '@',
  BOLD_ON: ESC + 'E' + '\x01',
  BOLD_OFF: ESC + 'E' + '\x00',
  ALIGN_LEFT: ESC + 'a' + '\x00',
  ALIGN_CENTER: ESC + 'a' + '\x01',
  ALIGN_RIGHT: ESC + 'a' + '\x02',
  CUT: GS + 'V' + '\x41' + '\x00',
  FEED: '\n',
  SIZE_NORMAL: ESC + '!' + '\x00',
  SIZE_DOUBLE_HEIGHT: ESC + '!' + '\x10',
  SIZE_DOUBLE_WIDTH: ESC + '!' + '\x20',
  SIZE_DOUBLE_BOTH: ESC + '!' + '\x30'
};

export const isWebUSBSupported = (): boolean => {
  return !!navigator.usb;
};

export const connectPrinter = async (): Promise<USBDevice> => {
  if (!isWebUSBSupported()) {
    throw new Error('WebUSB API not supported in this browser');
  }

  try {
    const device = await navigator.usb!.requestDevice({
      filters: [
        { vendorId: 0x0416 },  // Common thermal printer vendor IDs
        { vendorId: 0x0FE6 },
        { vendorId: 0x1A86 }
      ]
    });

    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    return device;
  } catch (error) {
    console.error('Printer connection failed:', error);
    throw error;
  }
};

export const sendToPrinter = async (device: USBDevice, data: string): Promise<void> => {
  const encoder = new TextEncoder();
  await device.transferOut(1, encoder.encode(data));
};

export const formatMoney = (amount: number): string => {
  return parseFloat(amount.toString()).toFixed(2) + ' DH';
};

export const generateReceipt = (order: PosOrder): string => {
  const { INIT, ALIGN_CENTER, SIZE_DOUBLE_BOTH, SIZE_NORMAL, ALIGN_LEFT, 
          BOLD_ON, BOLD_OFF, FEED, CUT } = thermalCommands;
  
  let receipt = INIT;
  
  // Header
  receipt += ALIGN_CENTER + SIZE_DOUBLE_BOTH;
  receipt += 'BOUMIA\n';
  receipt += SIZE_NORMAL + '----------------\n';
  receipt += ALIGN_LEFT;
  
  // Order info
  receipt += `Order: ${order.number}\n`;
  receipt += `Date: ${new Date(order.dateCreated).toLocaleString()}\n`;
  receipt += `Cashier: ${order.userName}\n`;
  receipt += '----------------\n';
  
  // Customer info
  if (order.customer) {
    receipt += `Customer: ${order.customer.name || 'N/A'}\n`;
    if (order.customer.code) receipt += `Code: ${order.customer.code}\n`;
    if (order.customer.phoneNumber) receipt += `Phone: ${order.customer.phoneNumber}\n`;
    receipt += '----------------\n';
  }
  
  // Items
  receipt += BOLD_ON + 'ITEMS:\n' + BOLD_OFF;
  order.items?.forEach(item => {
    const total = item.price * item.quantity;
    const discount = item.discountType === 0 
      ? item.discount * item.quantity
      : (total * item.discount) / 100;
    
    receipt += `${item.productName}\n`;
    receipt += `${item.quantity} x ${formatMoney(item.price)}`;
    
    if (item.discount > 0) {
      receipt += ` (Disc: ${item.discountType === 0 
        ? formatMoney(item.discount) 
        : item.discount + '%'})\n`;
    } else {
      receipt += '\n';
    }
    
    receipt += `= ${formatMoney(total - discount)}\n`;
    receipt += '----------------\n';
  });
  
  // Totals
  receipt +=  thermalCommands.ALIGN_RIGHT + BOLD_ON;
  receipt += `Subtotal: ${formatMoney(order.total + (order.discount || 0))}\n`;
  
  if (order.discount && order.discount > 0) {
    receipt += `Order Disc: ${order.discountType === 0 
      ? formatMoney(order.discount) 
      : order.discount + '%'}\n`;
  }
  
  receipt += `TOTAL: ${formatMoney(order.total)}\n`;
  receipt += BOLD_OFF + ALIGN_CENTER;
  receipt += 'Thank you for shopping!\n';
  receipt += FEED + FEED + FEED;
  receipt += CUT;
  
  return receipt;
};

export const printThermalReceipt = async (order: PosOrder): Promise<void> => {
  try {
    const printer = await connectPrinter();
    const receiptData = generateReceipt(order);
    await sendToPrinter(printer, receiptData);
  } catch (error) {
    console.error('Print error:', error);
    throw error;
  }
};