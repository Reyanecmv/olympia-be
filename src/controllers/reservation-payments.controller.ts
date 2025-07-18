import {
  IndexReservationPaymentsRequest,
  StoreReservationPaymentsRequest,
} from "@app-types/reservations/payments/index.js";
import { ServiceProvider } from "@utils/service-provider.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class ReservationPaymentsController {
  public static async index(
    request: FastifyRequest<IndexReservationPaymentsRequest>,
    reply: FastifyReply,
  ) {
    const { reservationPaymentsService } = ServiceProvider.getServices(
      request,
      ["reservationPaymentsService"],
    );

    const { limit, cursor } = request.query;

    const reservationPayments = await reservationPaymentsService.fetchAll(
      request.params.reservationId,
      cursor,
      limit,
    );
    const nextCursor = reservationPayments.slice(-1)[0]?.id ?? null;

    reply.send({
      success: true,
      data: reservationPayments,
      nextCursor,
    });
  }

  public static async store(
    request: FastifyRequest<StoreReservationPaymentsRequest>,
    reply: FastifyReply,
  ) {
    const { reservationPaymentsService } = ServiceProvider.getServices(
      request,
      ["reservationPaymentsService"],
    );

    const { success, error, message } = await request.server.executeAction(
      "CreateSimplePaymentAction",
      {
        amount: request.body.amount,
        reservationId: request.params.reservationId,
        paymentType: "",
        paymentDetails: {},
      },
    );

    if (!success) {
      return reply.status(400).send({ message, error });
    }

    await reservationPaymentsService.create(
        request,
      request.params.reservationId,
      request.body,
    );

    reply.send({
      success: true,
      message: "Payment successfuly registered",
    });
  }
}
