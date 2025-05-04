import { FastifyInstance } from "fastify";
import { authMiddleware } from "@middlewares/auth.middleware.js";

import { ReservationVehiclesController } from "@controllers/reservation-vehicles.controller.js";
import {
  CreateReservationVehicleRequest,
  DestroyReservationVehicleRequest,
  IndexReservationVehicleRequest,
  ShowReservationVehicleRequest,
} from "@app-types/reservations/vehicles/index.js";
import {
  destroyReservationVehicleSchema,
  indexReservationVehicleschema,
  showReservationVehicleSchema,
  storeReservationVehicleSchema,
} from "@validators/reservations/vehicles/index.js";

const reservationVehicleRoutes = async (fastify: FastifyInstance) => {
  fastify.get<IndexReservationVehicleRequest>(
    "/",
    { onRequest: authMiddleware, schema: indexReservationVehicleschema.schema },
    ReservationVehiclesController.index,
  );
  fastify.get<ShowReservationVehicleRequest>(
    "/:vehicleId",
    { onRequest: authMiddleware, schema: showReservationVehicleSchema.schema },
    ReservationVehiclesController.show,
  );
  fastify.post<CreateReservationVehicleRequest>(
    "/",
    { onRequest: authMiddleware, schema: storeReservationVehicleSchema.schema },
    ReservationVehiclesController.store,
  );
  fastify.delete<DestroyReservationVehicleRequest>(
    "/:vehicleId",
    {
      onRequest: authMiddleware,
      schema: destroyReservationVehicleSchema.schema,
    },
    ReservationVehiclesController.destroy,
  );
};

export default reservationVehicleRoutes;

export const autoPrefix = "/reservations/:reservationId/vehicles";
