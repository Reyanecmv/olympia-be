export const createReservationSchema = {
  schema: {
    headers: {
      type: "object",
      
      properties: {
        authorization: { type: "string" },
      },
    },
    body: {
      type: "object",
      required: [
        "licensePlate",
        "startDateTime",
        "tariffId",
        "overstayTariffId",
        "customerLastName",
        "customerFirstName",
        "customerEmail",
        "customerUId",
      ],
      properties: {
        licensePlate: { type: "string" },
        startDateTime: {
          type: "string",
          pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$",
          description:
            "Date and time in format YYYY-MM-DDThh:mm:ss without timezone",
        },
        endDateTime: {
          type: "string",
          pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$",
          description:
            "Date and time in format YYYY-MM-DDThh:mm:ss without timezone",
        },
        tariffId: { type: "string" },
        overstayTariffId: { type: "string" },
        customerLastName: { type: "string" },
        customerFirstName: { type: "string" },
        customerEmail: { type: "string", format: "email" },
        customerUId: { type: "string" },
        companyName: { type: "string" },
        customerAddress: { type: "string" },
        customerPhone: { type: "string" },
        customerMobile: { type: "string" },
        countryCode: { type: "string" },
        carMake: { type: "string" },
        carModel: { type: "string" },
        agencyCode: { type: "string" },
        paymentValue: { type: "number" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          data: { type: "string" },
        },
      },
    },
  },
};
