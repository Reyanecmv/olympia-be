import { Action } from "@app-types/app.js";
import { RESOLVER } from "awilix";
import { Cradle } from "@fastify/awilix";
import { axiosConfig } from "@config/axios.js";
import { BaseAction } from "@actions/base.action.js";
import { UpdateReservationRequest } from "@app-types/reservations/UpdateReservationRequest.js";

export interface EditReservationActionResult {
    reservationId: string;
    success: boolean;
    errorCode?: number;
    message?: string;
}

type EditReservationActionarams = UpdateReservationRequest["Body"] & {
    reservationId: string;
};

export default class EditReservationAction
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
        params: EditReservationActionarams,
    ): Promise<EditReservationActionResult> {
        const jsonObj = {
            "soap:Envelope": {
                "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                "soap:Body": {
                    updatePrebookingData: {
                        "@_xmlns": "http://www.designa.de/",
                        user: axiosConfig.user,
                        pwd: axiosConfig.password,
                        ReservationID: params.reservationId.toString(),
                        CarparkCode: 60,
                        VehicleRegistrationNumber: params.licensePlate,
                        ValidFrom: params.startDate,
                        ValidUntil: params.endDate,
                        GraceEntry: 0,
                        LatestEntryOffset: 0,
                        ForcedCloseOffset: 0,
                        TicketHandlingType: 0,
                        PaymentType: 0,
                        PaymentValue: params.paymentValue,
                    },
                },
            },
        };

        const xmlString = this.jsonToXml(jsonObj);
        console.log("XML Request String:", xmlString);
        try {
            const response = await this.axios.post(``, xmlString, {
                headers: {
                    "Content-Type": "text/xml; charset=utf-8",
                    SOAPAction: `"http://www.designa.de/updatePrebookingData"`,
                    Accept: "text/xml",
                },
            });

            if (
                typeof response === "string" &&
                response.includes("<soapenv:Fault>")
            ) {
                const errorDetails = this.parseSoapFault(response);

                return {
                    reservationId: params.reservationId.toString(),
                    success: false,
                    errorCode: errorDetails.errorCode,
                    message: this.getErrorMessage(errorDetails.errorCode),
                };
            }

            return {
                reservationId: params.reservationId.toString(),
                success: true,
                message: "Reservation updated successfully",
            };
        } catch (error) {
            return {
                reservationId: params.reservationId.toString(),
                success: false,
                message:
                    "Unable to update reservation due to a system error. Please try again later.",
            };
        }
    }

    /**
     * Get user-friendly error message based on error code
     */
    private getErrorMessage(errorCode: number): string {
        switch (errorCode) {
            case 2:
                return "Your reservation couldn't be found";
            case 3:
                return "Car park code not configured";
            case 4:
                return "Customer already entered the car park using the VehicleRegistrationNumber or the IdentCode";
            case 8:
                return "Customer already entered the car park using the VehicleRegistrationNumber or the IdentCode";
            case 9:
                return "Non unique vehicle registration number within booking period ";
            default:
                return "An error occurred with the parking reservation system. Please try again later.";
        }
    }
}

declare module "@app-types/app.js" {
    interface ActionTypes {
        EditReservationAction: EditReservationAction;
    }
}