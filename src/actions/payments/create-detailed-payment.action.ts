import { BaseAction } from "@actions/base.action.js";
import { Action } from "@app-types/app.js";
import { axiosConfig } from "@config/axios.js";
import { Cradle } from "@fastify/awilix";
import { AxiosPluginInstance } from "src/plugins/axios.js";

export default class CreateDetailedPaymentAction
  extends BaseAction
  implements Action
{
  private readonly axios: AxiosPluginInstance;
  constructor({ axios }: Cradle) {
    super();
    this.axios = axios;
  }

  public async execute(params: {
    reservationId: string;
    paymentType: string;
    paymentDetails: {
      merchantId?: string;
      terminalId?: string;
      authorizationCode?: string;
      surchargeAmount?: number;
      ticketNumber?: string;
      amount: number;
      netAmount: number;
      discountAmount?: number;
      taxRate?: number;
    };
  }) {
    const jsonObj = {
      "soapenv:Envelope": {
        "@_xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope",
        "@_xmlns:des": "http://www.designa.de/",
        "soapenv:Header": {},
        "soapenv:Body": {
          "des:insertPrebookingPayment": {
            "des:user": axiosConfig.user,
            "des:pwd": axiosConfig.password,
            "des:CarparkCode": "BUCHAREST_AIRPORT",
            "des:ReservationID": params.reservationId,
            "des:payDate": new Date().toISOString(),
            "des:payType": params.paymentType,
            "des:CCMerchantId": params.paymentDetails.merchantId || "",
            "des:CCTerminalId": params.paymentDetails.terminalId || "",
            "des:CCAuthCode": params.paymentDetails.authorizationCode || "",
            "des:AmountSurcharge": params.paymentDetails.surchargeAmount || 0,
            "des:CardCarrierNrId": params.paymentDetails.ticketNumber || "",
            "des:PaymentLines": [
              {
                "des:LineType": 301, // 301 = pre-payment for parking
                "des:Amount": params.paymentDetails.amount, // Gross amount in cents
                "des:AmountNet": params.paymentDetails.netAmount, // Net amount in cents
                "des:AmountDiscount": params.paymentDetails.discountAmount || 0,
                "des:TaxRate": params.paymentDetails.taxRate || 190, // 19% VAT as default
              },
            ],
          },
        },
      },
    };

    const xmlString = this.jsonToXml(jsonObj);

    this.axios.get("", {
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/xml",
      },
      data: xmlString,
    });

    return { success: true };
  }
}

declare module "@app-types/app.js" {
  interface ActionTypes {
    CreateDetailedPaymentAction: CreateDetailedPaymentAction;
  }
}
