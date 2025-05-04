export const showReservationVehicleSchema = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      properties: {
        reservationId: { type: "string" },
        vehicleId: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              id: { type: "string" },
              plateNumber: { type: "string" },
            },
          },
        },
      },
    },
  },
};
