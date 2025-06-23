export const showQrcodeSchema = {
    schema: {
        headers: {
            type: "object",
            required: ["authorization"],
            properties: {
                authorization: { type: "string" },
            },
        },
        params: {
            type: "object",
            properties: {
                reservationId: { type: "string" },
            },
        },
    },
};