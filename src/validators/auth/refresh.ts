export const refreshValidationSchema = {
  schema: {
    body: {
      type: "object",
      required: ["refresh_token"],
      properties: {
        refresh_token: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          access_token: { type: "string" },
          refresh_token: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
