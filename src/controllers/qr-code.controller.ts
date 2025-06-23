import { calculateCheckDigit } from "@utils/qrcode.js";
import { ServiceProvider } from "@utils/service-provider.js";
import { FastifyReply, FastifyRequest } from "fastify";
import QRCode from "qrcode";
import { ShowQrCodeRequest } from "@app-types/qrcode/ShowQrCodeRequest.js";

export class QrCodeController {
    static async show(
        request: FastifyRequest<ShowQrCodeRequest>,
        reply: FastifyReply,
    ) {
        try {
            const { reservationService } = ServiceProvider.getServices(request, [
                "reservationService",
            ]);
            const reservation = await reservationService.fetchOne(
                request.params.reservationId,
            );

            if (!reservation) {
                return reply.status(404).send({ message: "Reservation not found" });
            }

            const emiString = `EMI${request.params.reservationId.toString().padStart(17, "0")}`;

            const qrCodeValue = calculateCheckDigit(emiString);

            const qrCodeDataURL = await QRCode.toDataURL(qrCodeValue);

            return reply.send({ qrcode: qrCodeDataURL });
        } catch (error) {
            throw new Error("Failed to generate QR code");
        }
    }
}