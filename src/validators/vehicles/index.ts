export const indexVehiclesSchema = {
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
        type: "array",
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            licensePlate: { type: "string" },
          },
        },
        nextCursor: { type: ["string", "null"] },
      },
    },
  },
};

export * from "./show.js";
export * from "./store.js";
export * from "./update.js";
export * from "./destroy.js";
