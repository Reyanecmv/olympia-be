export const storeReservationPaymetnsSchema = {
  schema: {
    params: {
      type: "object",
      properties: {
        reservationId: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["amount"],
      properties: {
        amount: { type: "number" },
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
              amount: { type: "number" },
              currency: { type: "string" },
              status: { type: "string" },
              createdAt: { type: "string" },
            },
          },
        },
      },
    },
  },
};
