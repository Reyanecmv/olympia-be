export const indexReservationPaymentsSchema = {
  schema: {
    params: {
      type: "object",
      properties: {
        reservationId: { type: "string" },
      },
    },
    querystring: {
      type: "object",
      properties: {
        limit: { type: "number" },
        cursor: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: {
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
          nextCursor: { type: ["string", "null"] },
        },
      },
    },
  },
};

export * from "./store.js";
