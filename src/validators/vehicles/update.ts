export const updateVehiclesSchema = {
  schema: {
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["plateNumber"],
      properties: {
        plateNumber: { type: "string" },
      },
    },
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
        },
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
