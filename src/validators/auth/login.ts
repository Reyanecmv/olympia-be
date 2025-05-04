export const loginValidationSchema = {
  schema: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
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
      401: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
