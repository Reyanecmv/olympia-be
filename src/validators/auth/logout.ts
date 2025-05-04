export const logoutValidationSchema = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
