export const updateReservationSchema = {
  schema: {
    headers: {
      type: "object",
      
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: ["status"],
      properties: {
        status: { type: "string", enum: ["pending", "approved", "rejected"] },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              id: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              qrCode: { type: "string" },
              status: { type: "string" },
            },
          },
        },
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      403: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};
