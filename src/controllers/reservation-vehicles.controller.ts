import {
  CreateReservationVehicleRequest,
  DestroyReservationVehicleRequest,
  IndexReservationVehicleRequest,
  ShowReservationVehicleRequest,
} from "@app-types/reservations/vehicles/index.js";
import { ServiceProvider } from "@utils/service-provider.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class ReservationVehiclesController {
  public static async index(
    request: FastifyRequest<IndexReservationVehicleRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService } = ServiceProvider.getServices(request, [
      "vehicleService",
    ]);

    if (!request.userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { limit, cursor } = request.query;

    let vehicles = await vehicleService.fetchAllForReservation(
      request.params.reservationId,
      cursor,
      limit,
    );

    const nextCursor = vehicles.slice(-1)[0]?.id ?? null;

    reply.send({
      success: true,
      data: vehicles,
      nextCursor,
    });
  }

  public static async show(
    request: FastifyRequest<ShowReservationVehicleRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService, prismaClient } = ServiceProvider.getServices(
      request,
      ["vehicleService", "prismaClient"],
    );

    if (!request.userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const reservationVehicle = await prismaClient.reservationVehicle.findFirst({
      where: {
        reservationId: request.params.reservationId,
        vehicleId: request.params.vehicleId,
      },
    });
    if (!reservationVehicle) {
      return reply.status(404).send({
        message: "This vehicle is not part of the reservation",
      });
    }

    const vehicle = await vehicleService.fetchOne(request.params.vehicleId);

    reply.send({
      success: true,
      data: vehicle,
    });
  }

  public static async store(
    request: FastifyRequest<CreateReservationVehicleRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService, vehicleService } = ServiceProvider.getServices(
      request,
      ["reservationService", "vehicleService"],
    );

    const { reservationId } = request.params;

    const reservation = await reservationService.fetchOne(reservationId);

    if (!reservation) {
      return reply.status(404).send({
        message: "Reservation not found",
      });
    }

    const result = await vehicleService.create(reservation.id, request);

    reply.send({ result });
  }

  public static async destroy(
    request: FastifyRequest<DestroyReservationVehicleRequest>,
    reply: FastifyReply,
  ) {
    const { reservationService, vehicleService, prismaClient } =
      ServiceProvider.getServices(request, [
        "reservationService",
        "vehicleService",
        "prismaClient",
      ]);

    const { reservationId, vehicleId } = request.params;

    const reservation = await reservationService.fetchOne(reservationId);

    if (!reservation) {
      return reply.status(404).send({
        message: "Reservation not found",
      });
    }

    const reservationVehicle = await vehicleService.fetchOne(vehicleId);

    if (!reservationVehicle) {
      return reply.status(404).send({
        message: "Vehicle not found",
      });
    }

    await prismaClient.reservationVehicle.deleteMany({
      where: {
        reservationId,
        vehicleId,
      },
    });

    reply.send({
      message: "Vehicle was successfully removed from the reservation",
    });
  }
}
