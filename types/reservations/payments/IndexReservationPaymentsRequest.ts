export type IndexReservationPaymentsRequest = {
  Params: {
    reservationId: string;
  };
  Querystring: {
    limit?: number;
    cursor?: string;
  };
};
