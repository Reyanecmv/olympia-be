import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceProvider } from "@utils/service-provider.js";
import {
  DeleteReservationRequest,
  IndexReservationRequest,
  ShowReservationRequest,
  StoreReservationRequest,
  UpdateReservationRequest,
} from "@app-types/reservations/index.js";

export class ReservationsController {
  public static async index(
    request: FastifyRequest<IndexReservationRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService } = ServiceProvider.getServices(request, [
      "reservationService",
    ]);

    if (!request.userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { limit, cursor } = request.query;

    const reservations = await reservationService.fetchAll(
      request.userId,
      cursor,
      limit,
    );
    const nextCursor = reservations.slice(-1)[0]?.id ?? null;

    reply.send({
      success: true,
      data: reservations,
      nextCursor,
    });
  }

  public static async show(
    request: FastifyRequest<ShowReservationRequest>,
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
      const reservationInfo = await request.server.executeAction(
        "GetReservationAction",
        request.params.id,
      );
      return reply.send(reservationInfo);
    }

    reply.send({
      success: true,
      data: reservation,
    });
  }

  public static async update(
    request: FastifyRequest<UpdateReservationRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService } = ServiceProvider.getServices(request, [
      "reservationService",
    ]);

    const reservation = await reservationService.fetchOne(request.params.id);

    if (!reservation) {
      return reply.status(404).send({ message: "Reservation not found" });
    }

    if (reservation.customerId !== request.userId) {
      return reply
        .status(403)
        .send({ message: "You are not allowed to update this reservation" });
    }

    const updatedReservation = await reservationService.update(
      request.params.id,
      request.body,
    );

    reply.send({
      success: true,
      message: "Reservation updated successfully",
      data: updatedReservation,
    });
  }

  public static async store(
    request: FastifyRequest<StoreReservationRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService } = ServiceProvider.getServices(request, [
      "reservationService",
    ]);

    if (!request.userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { reservationId, success, message } =
      await request.server.executeAction(
        "CreateReservationAction",
        request.body,
      );

    if (!success) {
      return reply.status(400).send({ message, success });
    }

    await reservationService.create(request, {
      reservationId,
      userId: request.userId,
    });

    reply.send({
      success: true,
      reservationId: reservationId.toString(),
      message: "Reservation created successfully",
    });
  }

  public static async destroy(
    request: FastifyRequest<DeleteReservationRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService } = ServiceProvider.getServices(request, [
      "reservationService",
    ]);

    const reservation = await reservationService.fetchOne(request.params.id);

    // if (reservation?.customerId !== request.userId) {
    //   return reply
    //     .status(403)
    //     .send({ message: "You are not allow to remove this reservation" });
    // }

    if (!reservation) {
      return reply.status(404).send({ message: "Reservation not found" });
    }

    await reservationService.delete(request.params.id);

    reply.send({
      success: true,
      message: "Reservation deleted successfully",
    });
  }
}
