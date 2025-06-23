import { FastifyPluginAsync } from "fastify";

import { authMiddleware } from "@middlewares/auth.middleware.js";
import { ReservationsController } from "@controllers/reservations.controller.js";

import {
  DeleteReservationRequest,
  IndexReservationRequest,
  ShowReservationRequest,
  StoreReservationRequest,
} from "@app-types/reservations/index.js";
import {
  cancelReservationSchema,
  createReservationSchema,
  deleteReservationSchema,
  indexReservationSchema,
  showReservationSchema,
  updateReservationSchema,
} from "@validators/reservations/index.js";
import { UpdateReservationRequest } from "@app-types/reservations/UpdateReservationRequest.js";
import { CancelReservationsController } from "@controllers/cancel-reservations.controller.js";
import { CancelReservationRequest } from "@app-types/reservations/CancelReservationRequest.js";

const reservations: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<IndexReservationRequest>(
    "/",
    { onRequest: authMiddleware, schema: indexReservationSchema.schema },
    ReservationsController.index,
  );
  fastify.get<ShowReservationRequest>(
    "/:id",
    { onRequest: authMiddleware, schema: showReservationSchema.schema },
    ReservationsController.show,
  );
  fastify.put<UpdateReservationRequest>(
    "/:id",
    { onRequest: authMiddleware, schema: updateReservationSchema.schema },
    ReservationsController.update,
  );
  fastify.post<StoreReservationRequest>(
    "/",
    { onRequest: authMiddleware, schema: createReservationSchema.schema },
    ReservationsController.store,
  );
  fastify.delete<DeleteReservationRequest>(
    "/:id",
    { onRequest: authMiddleware, schema: deleteReservationSchema.schema },
    ReservationsController.destroy,
  );
  fastify.patch<CancelReservationRequest>(
      "/:id/cancel",
      { onRequest: authMiddleware, schema: cancelReservationSchema.schema },
      CancelReservationsController.update,
  );
};

export default reservations;

export const autoPrefix = "/reservations";
