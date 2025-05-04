import { RESOLVER } from "awilix";
import { BaseService } from "@services/base.service.js";
import { FastifyRequest } from "fastify";
import { StoreReservationRequest } from "@app-types/reservations/StoreReservationRequest.js";
import { randomBytes } from "crypto";
import argon2 from "argon2";

export class ReservationService extends BaseService {
  static [RESOLVER] = {};

  public async create(
    request: FastifyRequest<StoreReservationRequest>,
    options: { reservationId: string; userId: string },
  ) {
    const { disk, prismaClient } = this.ioc;

    await prismaClient.$transaction(async (trx) => {
      const password = await argon2.hash(
        randomBytes(10).toString("base64").slice(0, 10),
      );

      const existingCustomer = await trx.user.findUnique({
        where: {
          email: request.body.customerEmail,
        },
      });

      const qrCodePath = `${options.userId}/${options.reservationId}`;

      if (existingCustomer) {
        await trx.reservation.create({
          data: {
            reservationId: options.reservationId,
            endDate: new Date(),
            startDate: new Date(),
            qrCode: qrCodePath,
            customerId: existingCustomer.id,
            vehicles: {
              create: {
                vehicle: {
                  connectOrCreate: {
                    create: {
                      plateNumber: request.body.licensePlate,
                      meta: {
                        carMake: request.body.carMake,
                        carModel: request.body.carModel,
                      },
                    },
                    where: {
                      plateNumber: request.body.licensePlate,
                    },
                  },
                },
              },
            },
          },
          include: {
            vehicles: {
              include: {
                vehicle: true,
              },
            },
          },
        });

        return;
      }

      const customer = await trx.user.create({
        data: {
          firstName: request.body.customerFirstName,
          lastName: request.body.customerLastName,
          email: request.body.customerEmail,
          password,
          phoneNumber:
            request.body.customerPhone ?? request.body.customerMobile,
          reservations: {
            create: {
              reservationId: options.reservationId,
              endDate: new Date(),
              startDate: new Date(),
              qrCode: qrCodePath,
              vehicles: {
                create: {
                  vehicle: {
                    connectOrCreate: {
                      create: {
                        plateNumber: request.body.licensePlate,
                        meta: {
                          carMake: request.body.carMake,
                          carModel: request.body.carModel,
                        },
                      },
                      where: {
                        plateNumber: request.body.licensePlate,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          reservations: {
            include: {
              vehicles: true,
            },
          },
        },
      });

      if (request.body?.paymentValue) {
        await trx.payment.create({
          data: {
            amount: request.body.paymentValue,
            currency: "RON",
            reservationId: customer.reservations[0].id,
          },
        });
      }

      const qrCodeBuffer = await request.server.executeAction(
        "QRCodesGenerateAction",
        {
          reservationId: options.reservationId,
        },
      );

      await disk.putStream(qrCodePath, qrCodeBuffer, {
        contentType: "image/png",
        contentEncoding: "base64",
      });
    });
  }

  public async fetchAll(
    customerId: string,
    cursor?: string,
    limit: number = 10,
  ) {
    const { prismaClient } = this.ioc;
    return prismaClient.reservation.findMany({
      where: {
        customerId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  public async fetchOne(reservationId: string) {
    const { prismaClient } = this.ioc;
    return await prismaClient.reservation.findUnique({
      where: {
        reservationId,
      },
    });
  }

  public async update(reservationId: string, data: any) {
    const { prismaClient } = this.ioc;
    return prismaClient.reservation.update({
      where: {
        reservationId,
      },
      data,
    });
  }

  public async delete(reservationId: string) {
    const { prismaClient } = this.ioc;
    return prismaClient.reservation.delete({
      where: {
        id: reservationId,
      },
    });
  }
}
