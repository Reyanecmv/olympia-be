import { Action } from "@app-types/app.js";
import { RESOLVER } from "awilix";
import { Cradle } from "@fastify/awilix";
import { axiosConfig } from "@config/axios.js";
import { BaseAction } from "@actions/base.action.js";
import { StoreReservationRequest } from "@app-types/reservations/StoreReservationRequest.js";

export interface CreateReservationResult {
  reservationId: string;
  success: boolean;
  errorCode?: number;
  message?: string;
}

type SequenceResult = {
  reservationid: bigint;
};

export default class CreateReservationAction
  extends BaseAction
  implements Action
{
  static [RESOLVER] = {};
  private readonly axios;
  private readonly prismaClient;

  constructor({ axios, prismaClient }: Cradle) {
    super();

    this.axios = axios;
    this.prismaClient = prismaClient;
  }

  public async execute(
    params: StoreReservationRequest["Body"],
  ): Promise<CreateReservationResult> {
    const [{ reservationid: reservationId }] = await this.prismaClient
      .$queryRaw<
      SequenceResult[]
    >`SELECT nextval('emi_sequence') as reservationId`;

    const jsonObj = {
      "soap:Envelope": {
        "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        "soap:Body": {
          insertPrebookingDataV31: {
            "@_xmlns": "http://www.designa.de/",
            user: axiosConfig.user,
            pwd: axiosConfig.password,
            ReservationID: reservationId.toString(),
            TransactionType: "RN",
            CarparkCode: 60,
            VehicleRegistrationNumber: params.licensePlate,
            IdentMedium:
              `EMI${reservationId.toString().padStart(17, "0")}`.toString(),
            ValidFrom: params.startDateTime,
            ValidUntil: params.endDateTime,
            GraceEntry: 0,
            LatestEntryOffset: 0,
            ForcedCloseOffset: 0,
            TicketHandlingType: 0,
            PaymentType: 0,
            PaymentValue: params.paymentValue,
            BookingTariffId: params.tariffId,
            OverstayTariffId: params.overstayTariffId,
            LastName: params.customerLastName,
            FirstName: params.customerFirstName,
            Company: params.companyName,
            Address: params.customerAddress,
            Phone: params.customerPhone,
            MobilePhone: params.customerMobile,
            EMail: params.customerEmail,
            Data1: params.countryCode,
            Data2: params.carMake,
            Data3: params.carModel,
            Data4: params.agencyCode,
            MaxTrips: 1,
            MinutesOfValidity: 0,
            MaxIssueAmount: 1,
            Remark: "test",
            GraceExit: 0,
          },
        },
      },
    };

    const xmlString = this.jsonToXml(jsonObj);
    console.log(xmlString, "xmlString");
    console.log(axiosConfig.baseURL, "baseURL");
    try {
      const response = await this.axios.post(axiosConfig.baseURL, xmlString, {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: `"http://www.designa.de/insertPrebookingDataV31"`,
          Accept: "text/xml",
        },
      });

      if (
        typeof response === "string" &&
        response.includes("<soapenv:Fault>")
      ) {
        const errorDetails = this.parseSoapFault(response);

        return {
          reservationId: reservationId.toString(),
          success: false,
          errorCode: errorDetails.errorCode,
          message: this.getErrorMessage(errorDetails.errorCode),
        };
      }

      return {
        reservationId: reservationId.toString(),
        success: true,
        message: "Reservation created successfully",
      };
    } catch (error) {
      console.error("Error creating reservation:", error);
      return {
        reservationId: reservationId.toString(),
        success: false,
        message:
            `Unable to create reservation due to a system error. Please try again later. ${error}`,
      };
    }
  }

  /**
   * Get user-friendly error message based on error code
   */
  private getErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case 1:
        return "Your reservation couldn't be created due to a primary key error.";
      case 3:
        return "The specified car park is not available for reservations.";
      case 5:
        return "The reservation details are invalid. Please check your information and try again.";
      case 6:
        return "The customer account is not recognized.";
      case 8:
        return "Another reservation with this identification medium already exists for the selected time period.";
      case 9:
        return "Another reservation with this license plate already exists for the selected time period.";
      default:
        return "An error occurred with the parking reservation system. Please try again later.";
    }
  }
}

declare module "@app-types/app.js" {
  interface ActionTypes {
    CreateReservationAction: CreateReservationAction;
  }
}
