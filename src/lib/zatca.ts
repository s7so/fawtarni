/**
 * ZATCA Phase 1 TLV QR Code encoding
 * Tags:
 *  1 = Seller Name
 *  2 = VAT Registration Number
 *  3 = Timestamp (ISO 8601)
 *  4 = Invoice Total (with VAT)
 *  5 = VAT Amount
 */

function tlv(tag: number, value: string): Uint8Array {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(value);
  const result = new Uint8Array(2 + encoded.length);
  result[0] = tag;
  result[1] = encoded.length;
  result.set(encoded, 2);
  return result;
}

function concatArrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function generateZatcaQRData(
  sellerName: string,
  vatNumber: string,
  timestamp: string,
  totalWithVat: string,
  vatAmount: string
): string {
  const t1 = tlv(1, sellerName);
  const t2 = tlv(2, vatNumber);
  const t3 = tlv(3, timestamp);
  const t4 = tlv(4, totalWithVat);
  const t5 = tlv(5, vatAmount);

  const combined = concatArrays(t1, t2, t3, t4, t5);
  return uint8ArrayToBase64(combined);
}
