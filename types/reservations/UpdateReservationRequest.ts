export type UpdateReservationRequest = {
  Params: { id: string };
  Body: {
    status: "pending" | "approved" | "rejected";
  };
};
