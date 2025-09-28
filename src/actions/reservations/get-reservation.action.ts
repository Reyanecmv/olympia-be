import { Action } from "@app-types/app.js";
import { RESOLVER } from "awilix";
import { Cradle } from "@fastify/awilix";
import { axiosConfig } from "@config/axios.js";
import { BaseAction } from "@actions/base.action.js";

export default class GetReservationAction extends BaseAction implements Action {
  static [RESOLVER] = {};
  private readonly axios;

  constructor({ axios }: Cradle) {
    super();

    this.axios = axios;
  }

  public async execute(reservationId: string) {
    const jsonObj = {
      "soap:Envelope": {
        "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        "soap:Body": {
          getPrebookings: {
            "@_xmlns": "http://www.designa.de/",
            user: axiosConfig.user,
            pwd: axiosConfig.password,
            reservationID: reservationId,
            carparkCode: 60,
          },
        },
      },
    };

    const xmlString = this.jsonToXml(jsonObj);

    try {
      const response = await this.axios.post(``, xmlString, {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: `"http://www.designa.de/getPrebookings"`,
          Accept: "text/xml",
        },
      });

      if (
        typeof response === "string" &&
        response.includes("<soapenv:Fault>")
      ) {
        const errorDetails = this.parseSoapFault(response);

        return {
          reservationId,
          success: false,
          errorCode: errorDetails.errorCode,
          message: this.getErrorMessage(errorDetails.errorCode),
        };
      }

      const data = this.parseResponse(response);

      return {
        reservationId,
        success: true,
        data,
      };
    } catch (error) {
      return {
        reservationId,
        success: false,
        message:
          `Unable to create reservation due to a system error. Please try again later. ${error}`,
      };
    }
  }

  private hasArrivalDate(obj: any) {
    return obj.CardUId !== '00000000-0000-0000-0000-000000000000';
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

  private parseResponse(body: string) {
    const data = this.xmlParser.parse(body);

    const prebookingEntry =
      data["soap:Envelope"]["soap:Body"].getPrebookingsResponse
        .getPrebookingsResult.DesignaPrebookingEntry;

    console.error(prebookingEntry);

    const reservationInfo = {
      reservationId: prebookingEntry["@_ReservationID"],
      transactionType: prebookingEntry._TransactionType,
      carparkCode: prebookingEntry.CarparkCode,
      state: this.hasArrivalDate(prebookingEntry),
      vehicleInfo: {
        registrationNumber: prebookingEntry.VehicleRegistrationNumber,
        identMedium: prebookingEntry.IdentMedium,
        make: prebookingEntry.Data2,
        model: prebookingEntry.Data3,
        country: prebookingEntry.Data1,
      },
      validityPeriod: {
        from: prebookingEntry.ValidFrom,
        until: prebookingEntry.ValidUntil,
      },
      customerInfo: {
        firstName: prebookingEntry.FirstName,
        lastName: prebookingEntry.LastName,
        email: prebookingEntry.EMail,
        phone: prebookingEntry.Phone,
      },
    };

    console.log(reservationInfo);

    return reservationInfo;
  }
}


declare module "@app-types/app.js" {
  interface ActionTypes {
    GetReservationAction: GetReservationAction;
  }
}
