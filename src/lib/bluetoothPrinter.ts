// Web Bluetooth API for ESC/POS thermal printers (58mm)
// Compatible with EPPOS and similar Bluetooth thermal printers

const BT_SERVICE = "000018f0-0000-1000-8000-00805f9b34fb";
const BT_CHARACTERISTIC = "00002af1-0000-1000-8000-00805f9b34fb";

let btChar: BluetoothRemoteGATTCharacteristic | null = null;
let btDeviceName: string | null = null;

export function isPrinterConnected(): boolean {
  return btChar !== null;
}

export function getPrinterName(): string | null {
  return btDeviceName;
}

export async function connectPrinter(): Promise<boolean> {
  if (!navigator.bluetooth) {
    throw new Error("Bluetooth tidak tersedia. Gunakan Chrome di Android.");
  }
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BT_SERVICE] }],
      optionalServices: [BT_SERVICE],
    });
    const server = await device.gatt!.connect();
    const service = await server.getPrimaryService(BT_SERVICE);
    btChar = await service.getCharacteristic(BT_CHARACTERISTIC);
    btDeviceName = device.name || "Printer";

    // Listen for disconnect
    device.addEventListener("gattserverdisconnected", () => {
      btChar = null;
      btDeviceName = null;
    });

    return true;
  } catch (e: any) {
    btChar = null;
    btDeviceName = null;
    throw new Error("Gagal koneksi: " + (e.message || e));
  }
}

export async function disconnectPrinter(): Promise<void> {
  btChar = null;
  btDeviceName = null;
}

async function btSend(data: Uint8Array): Promise<void> {
  if (!btChar) throw new Error("Printer belum terhubung");
  const chunk = 300;
  for (let i = 0; i < data.length; i += chunk) {
    await btChar.writeValue(data.slice(i, i + chunk));
  }
}

// ESC/POS commands
const ESC = "\x1B";
const INIT = ESC + "\x40";
const CENTER = ESC + "\x61\x01";
const LEFT = ESC + "\x61\x00";
const BOLD_ON = ESC + "\x45\x01";
const BOLD_OFF = ESC + "\x45\x00";
const LINE = "================================\n";
const DASH = "--------------------------------\n";

const rp = (n: number) => Number(n).toLocaleString("id-ID");
const fmtTime = (d: Date) => d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  note?: string | null;
}

export interface ReceiptData {
  orderId: string;
  orderType: "dine" | "takeaway";
  paymentMethod: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  cashPaid?: number;
}

export async function printReceipt(data: ReceiptData): Promise<void> {
  if (!btChar) throw new Error("Printer belum terhubung");

  const now = new Date();
  let t = INIT;

  // Header
  t += CENTER + BOLD_ON + "WARKOP AJ\n" + BOLD_OFF;
  t += "Kopi & Makanan Khas Medan\n";
  t += LINE;

  // Order info
  t += BOLD_ON + (data.orderType === "takeaway" ? "TAKE AWAY" : "DINE IN") + "\n" + BOLD_OFF;
  t += DASH;
  t += LEFT;
  t += "Order  : #" + data.orderId + "\n";
  t += "Tanggal: " + fmtDate(now) + " " + fmtTime(now) + "\n";
  t += "Bayar  : " + data.paymentMethod.toUpperCase() + "\n";
  t += DASH;

  // Items
  data.items.forEach((item) => {
    t += item.name + "\n";
    if (item.note) t += "   *(" + item.note + ")\n";
    const left = " " + item.quantity + "x Rp " + rp(item.price);
    const right = "Rp " + rp(item.quantity * item.price);
    const pad = Math.max(1, 32 - left.length - right.length);
    t += left + " ".repeat(pad) + right + "\n";
  });

  // Totals
  t += DASH;
  t += "Subtotal".padEnd(20) + "Rp " + rp(data.subtotal) + "\n";
  t += "PPN 11%".padEnd(20) + "Rp " + rp(data.tax) + "\n";
  t += DASH;
  t += BOLD_ON + "TOTAL".padEnd(20) + "Rp " + rp(data.total) + "\n" + BOLD_OFF;

  // Cash change
  if (data.paymentMethod === "cash" && data.cashPaid) {
    const change = data.cashPaid - data.total;
    t += "Tunai".padEnd(20) + "Rp " + rp(data.cashPaid) + "\n";
    t += BOLD_ON + "Kembalian".padEnd(20) + "Rp " + rp(change) + "\n" + BOLD_OFF;
  }

  t += LINE;

  // Footer
  t += CENTER + "\nTerima kasih!\n";
  t += "IG: @warkopaj\n";
  t += '"Ngopi Santai, Rasa Istimewa!"\n';
  t += "\n\n\n"; // Feed paper

  await btSend(new TextEncoder().encode(t));

  // Print QR code with order ID
  await printQR("WAJ-" + data.orderId);
}

async function printQR(text: string): Promise<void> {
  const G = "\x1D";
  const qr =
    G + "(k" + String.fromCharCode(4, 0, 49, 65, 50, 0) +
    G + "(k" + String.fromCharCode(3, 0, 49, 67, 6) +
    G + "(k" + String.fromCharCode(3, 0, 49, 69, 48) +
    G + "(k" + String.fromCharCode(text.length + 3, 0, 49, 80, 48) + text +
    G + "(k" + String.fromCharCode(3, 0, 49, 81, 48);
  await btSend(new TextEncoder().encode(qr));
}
