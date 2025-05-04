import { BaseService } from "@services/base.service.js";
import { RESOLVER } from "awilix";
import { FastifyRequest } from "fastify";
import { CreateReservationVehicleRequest } from "@app-types/reservations/vehicles/CreateReservationVehicleRequest.js";

export class VehicleService extends BaseService {
  static [RESOLVER] = {};
  public async create(
    reservationId: string,
    request: FastifyRequest<CreateReservationVehicleRequest>,
  ) {
    const { prismaClient } = this.ioc;
    await prismaClient.$transaction(async (trx) => {
      const result = await Promise.all(
        request.body.licensePlates.map((licensePlate) =>
          request.server.executeAction("CreateVehicleAction", {
            licensePlates: [licensePlate],
            reservationId,
          }),
        ),
      );

      if (result.some((r) => !r.success)) {
        throw new Error("Failed to create vehicle");
      }

      await trx.vehicle.createMany({
        data: request.body.licensePlates.map((plateNumber) => ({
          plateNumber,
          meta: {},
        })),
        skipDuplicates: true,
      });

      const vehicles = await trx.vehicle.findMany({
        where: {
          plateNumber: {
            in: request.body.licensePlates,
          },
        },
        select: {
          id: true,
          plateNumber: true,
        },
      });

      await trx.reservationVehicle.createMany({
        data: vehicles.map((vehicle) => ({
          reservationId,
          vehicleId: vehicle.id,
        })),
        skipDuplicates: true,
      });
    });
  }
  public async fetchAll(cursor?: string, limit: number = 10) {
    const { prismaClient } = this.ioc;
    return prismaClient.vehicle.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  public async fetchAllForReservation(
    reservationId: string,
    cursor?: string,
    limit: number = 10,
  ) {
    const { prismaClient } = this.ioc;
    return await prismaClient.vehicle.findMany({
      where: {
        reservation: {
          some: {
            reservationId,
          },
        },
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  public async fetchOne(vehicleId: string) {
    const { prismaClient } = this.ioc;
    return prismaClient.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });
  }

  public async update(vehicleId: string, data: any) {
    const { prismaClient } = this.ioc;
    return prismaClient.vehicle.update({
      where: {
        id: vehicleId,
      },
      data,
    });
  }

  public async createOne(data: any) {
    const { prismaClient } = this.ioc;
    return prismaClient.vehicle.create({
      data,
      select: { id: true },
    });
  }

  public async delete(vehicleId: string) {
    const { prismaClient } = this.ioc;
    return prismaClient.vehicle.delete({
      where: {
        id: vehicleId,
      },
    });
  }
}
