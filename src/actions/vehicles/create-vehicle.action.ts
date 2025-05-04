import { BaseAction } from "@actions/base.action.js";
import { Action } from "@app-types/app.js";
import { axiosConfig } from "@config/axios.js";
import { Cradle } from "@fastify/awilix";
import { AxiosPluginInstance } from "src/plugins/axios.js";

type ResultItem = {
  licensePlate: string;
  success: boolean;
  errorCode?: string;
  message?: string;
};

export default class CreateVehicleAction extends BaseAction implements Action {
  private readonly axios: AxiosPluginInstance;
  constructor({ axios }: Cradle) {
    super();
    this.axios = axios;
  }
  public async execute(params: {
    licensePlates: string[];
    reservationId: string;
  }): Promise<{
    success: boolean;
    results: ResultItem[];
    errorCode?: string;
    message?: string;
  }> {
    const results: ResultItem[] = [];

    try {
      for (const licensePlate of params.licensePlates) {
        const jsonObj = {
          "soapenv:Envelope": {
            "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
            "soap:Body": {
              addPrebookingIdentMedium: {
                "@_xmlns": "http://www.designa.de/",
                user: axiosConfig.user,
                pwd: axiosConfig.password,
                reservationId: params.reservationId,
                identMedium: licensePlate,
                identMediumKind: "LICENSE_PLATE",
                identMediumPriority: "1",
              },
            },
          },
        };

        const xmlString = this.jsonToXml(jsonObj);

        try {
          const response = await this.axios.get("", {
            headers: {
              "Content-Type": "text/xml; charset=utf-8",
              SOAPAction: `"http://www.designa.de/addPrebookingIdentMedium"`,
              Accept: "text/xml",
            },
            data: xmlString,
          });

          if (
            typeof response === "string" &&
            response.includes("<soapenv:Fault>")
          ) {
            const errorDetails = this.parseSoapFault(response);
            const resultItem: ResultItem = {
              licensePlate,
              success: false,
              errorCode: errorDetails.errorCode.toString(),
              message: this.getErrorMessage(errorDetails.errorCode),
            };
            results.push(resultItem);
          } else {
            const resultItem: ResultItem = {
              licensePlate,
              success: true,
            };
            results.push(resultItem);
          }
        } catch (error: unknown) {
          console.error(
            `Error processing license plate ${licensePlate}:`,
            error,
          );
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          const resultItem: ResultItem = {
            licensePlate,
            success: false,
            errorCode: "API_ERROR",
            message: errorMessage,
          };
          results.push(resultItem);
        }
      }

      // Overall success if at least one license plate was successful
      const anySuccess = results.some((result) => result.success);

      return {
        success: anySuccess,
        results: results,
      };
    } catch (error) {
      console.error("Unexpected error in execute method:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return {
        success: false,
        results: [],
        errorCode: "UNEXPECTED_ERROR",
        message: errorMessage,
      };
    }
  }

  /**
   * Get user-friendly error message based on error code
   */
  private getErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case 2:
        return "Error no data found";
      case 8:
        return "Non unique identification medium within booking period";
      case 9:
        return "Non unique vehicle registration number within booking period";
      default:
        return "An error occurred with the qr code registration. Please try again later.";
    }
  }
}

declare module "@app-types/app.js" {
  interface ActionTypes {
    CreateVehicleAction: CreateVehicleAction;
  }
}
