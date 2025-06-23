import { authMiddleware } from "@middlewares/auth.middleware.js";
import { FastifyInstance } from "fastify";
import { ShowQrCodeRequest } from "@app-types/qrcode/ShowQrCodeRequest.js";
import { showQrcodeSchema } from "@validators/qrcode/show.js";
import { QrCodeController } from "@controllers/qr-code.controller.js";

const qrcodeRoutes = async (fastify: FastifyInstance) => {
    fastify.get<ShowQrCodeRequest>(
        "/:reservationId",
        {
            onRequest: authMiddleware,
            schema: showQrcodeSchema.schema,
        },
        QrCodeController.show,
    );
};

export default qrcodeRoutes;

export const autoPrefix = "/qrcode";