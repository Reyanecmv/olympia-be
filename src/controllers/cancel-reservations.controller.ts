import { CancelReservationRequest } from "@app-types/reservations/index.js";
import { ServiceProvider } from "@utils/service-provider.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class CancelReservationsController {
  public static async update(
    request: FastifyRequest<CancelReservationRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService } = ServiceProvider.getServices(request, [
      "reservationService",
    ]);

    if (!request.userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const reservation = await reservationService.fetchOne(request.params.id);

    if (!reservation) {
      return reply.status(404).send({ message: "Reservation not found" });
    }

    const reservationInfo = await request.server.executeAction(
      "CancelReservationAction",
      request.params.id,
    );
    return reply.send(reservationInfo);
  }
}