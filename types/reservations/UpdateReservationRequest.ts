export type UpdateReservationRequest = {
  Params: { id: string };
  Body: {
    licensePlate: string;
    startDate: string;
    endDate: string;
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