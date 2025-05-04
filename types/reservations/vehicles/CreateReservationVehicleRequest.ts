export type CreateReservationVehicleRequest = {
  Body: {
    licensePlates: string[];
  };
  Params: {
    reservationId: string;
  };
};
