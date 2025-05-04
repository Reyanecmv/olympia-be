export * from "./health.js";

export const indexSchema = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          hello: { type: "string", enum: ["world"] },
        },
      },
    },
  },
};
