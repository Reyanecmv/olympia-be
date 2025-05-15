export const showReservationSchema = {
  schema: {
    headers: {
      type: "object",
      
      properties: {
        authorization: { type: "string" },
      },
    },
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
    // response: {
    // 200: {
    //   type: "object",
    //   properties: {
    //     success: { type: "boolean" },
    //     message: { type: "string" },
    //     data: {
    //       type: "object",
    //       properties: {
    //         id: { type: "string" },
    //         startDate: { type: "string" },
    //         endDate: { type: "string" },
    //         qrCode: { type: "string" },
    //       },
    //     },
    //   },
    // },
    // },
  },
};
