import { DestroyVehiclesRequest } from "@app-types/vehicles/DestroyVehiclesRequest.js";
import { IndexVehiclesRequest } from "@app-types/vehicles/IndexVehiclesRequest.js";
import { ShowVehiclesRequest } from "@app-types/vehicles/ShowVehiclesRequest.js";
import { StoreVehiclesRequest } from "@app-types/vehicles/StoreVehiclesRequest.js";
import { UpdateVehiclesRequest } from "@app-types/vehicles/UpdateVehiclesRequest.js";
import { ServiceProvider } from "@utils/service-provider.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class VehiclesController {
  public static async index(
    request: FastifyRequest<IndexVehiclesRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService } = ServiceProvider.getServices(request, [
      "vehicleService",
    ]);

    const { limit, cursor } = request.query;

    const vehicles = await vehicleService.fetchAll(cursor, limit);
    const nextCursor = vehicles.slice(-1)[0]?.id ?? null;

    reply.send({
      success: true,
      data: vehicles,
      nextCursor,
    });
  }

  public static async show(
    request: FastifyRequest<ShowVehiclesRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService } = ServiceProvider.getServices(request, [
      "vehicleService",
    ]);

    const vehicle = await vehicleService.fetchOne(request.params.id);

    if (!vehicle) {
      return reply.status(404).send({ message: "Vehicle not found" });
    }

    reply.send({
      success: true,
      data: vehicle,
    });
  }

  public static async update(
    request: FastifyRequest<UpdateVehiclesRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService } = ServiceProvider.getServices(request, [
      "vehicleService",
    ]);

    const vehicle = await vehicleService.fetchOne(request.params.id);

    if (!vehicle) {
      return reply.status(404).send({ message: "Vehicle not found" });
    }

    await vehicleService.update(request.params.id, request.body);

    reply.send({
      success: true,
      message: "Vehicle updated successfully",
    });
  }

  public static async store(
    request: FastifyRequest<StoreVehiclesRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService } = ServiceProvider.getServices(request, [
      "vehicleService",
    ]);

    const { id: vehicleId } = await vehicleService.createOne(request.body);

    reply.send({
      success: true,
      vehicleId,
      message: "Vehicle created successfully",
    });
  }

  public static async destroy(
    request: FastifyRequest<DestroyVehiclesRequest>,
    reply: FastifyReply,
  ) {
    const { vehicleService } = ServiceProvider.getServices(request, [
      "vehicleService",
    ]);

    const vehicle = await vehicleService.fetchOne(request.params.id);

    if (!vehicle) {
      return reply.status(404).send({ message: "Reservation not found" });
    }

    await vehicleService.delete(request.params.id);

    reply.send({
      success: true,
      message: "Reservation deleted successfully",
    });
  }
}
