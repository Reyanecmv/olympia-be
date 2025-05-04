export const indexReservationVehicleschema = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
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
                plateNumber: { type: "string" },
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
export * from "./show.js";
export * from "./destroy.js";
