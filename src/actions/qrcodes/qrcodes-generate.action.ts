import { Action } from "@app-types/app.js";
import { RESOLVER } from "awilix";
import QRCode from "qrcode";
import { Transform } from "stream";
import { BaseAction } from "@actions/base.action.js";

export default class QRCodesGenerateAction
  extends BaseAction
  implements Action
{
  static [RESOLVER] = {};

  constructor() {
    super();
  }

  public async execute(params: { reservationId: string }) {
    const emiString = `EMI${params.reservationId.toString().padStart(17, "0")}`;

    const qrCodeValue = this.calculateCheckDigit(emiString);

    const stream = new Transform({
      transform(chunk, _encoding, callback) {
        this.push(chunk);
        callback();
      },
    });

    QRCode.toFileStream(stream, qrCodeValue);

    return stream;
  }

  /**
   * Calculate the check digit for an EMI ID to generate the QR code value.
   *
   * @param emiId The EMI ID (e.g., 'EMI00000000000026935')
   * @returns The complete QR code value
   */
  private calculateCheckDigit(emiId: string): string {
    // Ensure proper format
    if (!emiId.startsWith("EMI")) {
      throw new Error("ID must start with 'EMI'");
    }

    // Extract the numeric part
    const numericPart = emiId.substring(3); // Remove 'EMI'

    // Get the last 5 digits
    const lastFive = parseInt(numericPart.slice(-5), 10);

    // Extract tens and units digits
    const tensDigit = Math.floor(lastFive / 10) % 10;
    const unitsDigit = lastFive % 10;

    // Base sequence for 90s: 2, 8, 1, 7, 0, 3, 9, 2, 5, 8
    // Each subsequent "tens" sequence adds 1 (mod 10) to each element

    // Define the base sequence (for tensDigit = 9)
    const baseSequence = [2, 8, 1, 7, 0, 3, 9, 2, 5, 8];

    // Calculate offset for current tens digit (9 - tensDigit)
    const offset = (9 - tensDigit) % 10;

    // Get the correct sequence for this tens digit
    const currentSequence = baseSequence.map((digit) => (digit + offset) % 10);

    // Map units digit to position in sequence
    // Units digits 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 map to positions 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    const position = (9 - unitsDigit) % 10;

    // Get check digit
    const checkDigit = currentSequence[position];

    // Create the QR code value: 47 + numericPart + checkDigit
    const qrCode = `47${numericPart}${checkDigit}`;

    return qrCode;
  }
}

declare module "@app-types/app.js" {
  interface ActionTypes {
    QRCodesGenerateAction: QRCodesGenerateAction;
  }
}
