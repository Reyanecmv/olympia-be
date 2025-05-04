import {
  IndexReservationPaymentsRequest,
  StoreReservationPaymentsRequest,
} from "@app-types/reservations/payments/index.js";
import { ReservationPaymentsController } from "@controllers/reservation-payments.controller.js";
import { authMiddleware } from "@middlewares/auth.middleware.js";
import {
  indexReservationPaymentsSchema,
  storeReservationPaymetnsSchema,
} from "@validators/reservations/payments/index.js";
import { FastifyInstance } from "fastify";

const reservationPaymentsRoutes = async (fastify: FastifyInstance) => {
  fastify.get<IndexReservationPaymentsRequest>(
    "/",
    {
      onRequest: authMiddleware,
      schema: indexReservationPaymentsSchema.schema,
    },
    ReservationPaymentsController.index,
  );
  fastify.post<StoreReservationPaymentsRequest>(
    "/",
    {
      onRequest: authMiddleware,
      schema: storeReservationPaymetnsSchema.schema,
    },
    ReservationPaymentsController.store,
  );
};

export default reservationPaymentsRoutes;

export const autoPrefix = "/reservations/:reservationId/payments";
