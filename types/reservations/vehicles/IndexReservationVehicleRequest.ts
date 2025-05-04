export type IndexReservationVehicleRequest = {
  Params: {
    reservationId: string;
  };
  Querystring: {
    limit?: number;
    cursor?: string;
  };
};
