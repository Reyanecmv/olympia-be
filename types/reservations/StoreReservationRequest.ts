export type StoreReservationRequest = {
  Body: {
    licensePlate: string;
    startDateTime: string;
    endDateTime: string;
    tariffId: string;
    overstayTariffId: string;
    customerLastName: string;
    customerFirstName: string;
    customerEmail: string;
    customerUId: string;
    companyName?: string;
    customerAddress?: string;
    customerPhone?: string;
    customerMobile?: string;
    countryCode?: string;
    carMake?: string;
    carModel?: string;
    agencyCode?: string;
    paymentValue?: number;
  };
};
