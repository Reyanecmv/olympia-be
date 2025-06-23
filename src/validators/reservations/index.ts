export const indexReservationSchema = {
  schema: {
    headers: {
      type: "object",
      
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
                startDate: { type: "string" },
                endDate: { type: "string" },
                qrCode: { type: "string" },
              },
            },
          },
          nextCursor: { type: ["string", "null"] },
        },
      },
    },
  },
};

export * from "./show.js";
export * from "./create.js";
export * from "./delete.js";
export * from "./update.js";
export * from "./cancel.js";

