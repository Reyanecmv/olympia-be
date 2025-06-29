import { StoreReservationPaymentsRequest } from "@app-types/reservations/payments/index.js";
import { BaseService } from "@services//base.service.js";
import { RESOLVER } from "awilix";

export class ReservationPaymentsService extends BaseService {
  static [RESOLVER] = {};

  public async fetchAll(
    reservationId: string,
    cursor?: string,
    limit: number = 10,
  ) {
    const { prismaClient } = this.ioc;
    return await prismaClient.payment.findMany({
      where: {
        reservationId,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  public async create(
      request: any,
    reservationId: string,
    body: StoreReservationPaymentsRequest["Body"],
  ) {
    const { prismaClient } = this.ioc;
    let res = null;

      res = await prismaClient.reservation.findUnique({
        where: {
          reservationId,
        },
      });

    return await prismaClient.payment.create({
      data: {
        reservationId: res!.id,
        amount: Number(body.amount),
        currency: "RON",
      },
    });
  }
}
