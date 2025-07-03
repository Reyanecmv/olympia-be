export type UpdateReservationRequest = {
  Params: { id: string };
  Body: {
    licensePlate: string;
    startDateTime: string;
    endDateTime: string;
    customerLastName?: string;
    customerFirstName?: string;
    customerEmail?: string;
    customerUId?: string;
    companyName?: string;
    customerAddress?: string;
    customerPhone?: string;
    customerMobile?: string;
    countryCode?: string;
    paymentValue?: number;
  };
};