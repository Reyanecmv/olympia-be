import { Action } from "@app-types/app.js";
import { RESOLVER } from "awilix";
import QRCode from "qrcode";
import { Transform } from "stream";
import { BaseAction } from "@actions/base.action.js";
import { calculateCheckDigit } from "@utils/qrcode.js";

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

    const qrCodeValue = calculateCheckDigit(emiString);

    const stream = new Transform({
      transform(chunk, _encoding, callback) {
        this.push(chunk);
        callback();
      },
    });

    QRCode.toFileStream(stream, qrCodeValue);

    return stream;
  }
}

declare module "@app-types/app.js" {
  interface ActionTypes {
    QRCodesGenerateAction: QRCodesGenerateAction;
  }
}