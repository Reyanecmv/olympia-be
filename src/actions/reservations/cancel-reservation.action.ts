import { Action } from "@app-types/app.js";
import { RESOLVER } from "awilix";
import { Cradle } from "@fastify/awilix";
import { axiosConfig } from "@config/axios.js";
import { BaseAction } from "@actions/base.action.js";

export interface CancelReservationResult {
    reservationId: string;
    success: boolean;
    errorCode?: number;
    message?: string;
}

export default class CancelReservationAction
    extends BaseAction
    implements Action
{
    static [RESOLVER] = {};
    private readonly axios;

    constructor({ axios }: Cradle) {
        super();

        this.axios = axios;
    }

    public async execute(
        reservationId: string,
    ): Promise<CancelReservationResult> {
        const jsonObj = {
            "soap:Envelope": {
                "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                "soap:Body": {
                    cancelPrebooking: {
                        "@_xmlns": "http://www.designa.de/",
                        user: axiosConfig.user,
                        pwd: axiosConfig.password,
                        reservationID: reservationId,
                    },
                },
            },
        };

        const xmlString = this.jsonToXml(jsonObj);

        try {
            const response = await this.axios.post(``, xmlString, {
                headers: {
                    "Content-Type": "text/xml; charset=utf-8",
                    SOAPAction: `"http://www.designa.de/cancelPrebooking"`,
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

            return {
                reservationId,
                success: true,
                message: "Reservation canceled successfully",
            };
        } catch (error) {
            return {
                reservationId,
                success: false,
                message:
                    "Unable to cancel reservation due to a system error. Please try again later.",
            };
        }
    }

    /**
     * Get user-friendly error message based on error code
     */
    private getErrorMessage(errorCode: number): string {
        switch (errorCode) {
            case 1:
                return "Your reservation couldn't be canceled";
            case 2:
                return "Reservation not found";
            case 4:
                return "Customer already entered car park";
            default:
                return "An error occurred with the parking reservation system. Please try again later.";
        }
    }
}

declare module "@app-types/app.js" {
    interface ActionTypes {
        CancelReservationAction: CancelReservationAction;
    }
}