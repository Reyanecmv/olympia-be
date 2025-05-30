export const storeReservationVehicleSchema = {
  schema: {
    headers: {
      type: "object",
      
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["licensePlates"],
      properties: {
        licensePlates: { type: "array" },
      },
    },
    params: {
      type: "object",
      required: ["reservationId"],
      properties: {
        reservationId: { type: "string" },
      },
    },
  },
};
