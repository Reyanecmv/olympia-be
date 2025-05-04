export const healthChekSchema = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          uptime: { type: "number" },
          database: { type: "string", enum: ["up", "down", "unknown"] },
          redis: {
            type: "string",
            enum: ["connected", "disconnected", "unknown"],
          },
        },
      },
    },
  },
};
