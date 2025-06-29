import { BaseAction } from "@actions/base.action.js";
import { Action } from "@app-types/app.js";
import { axiosConfig } from "@config/axios.js";
import { Cradle } from "@fastify/awilix";
import { PrismaClient } from "@prisma/client";
import { AxiosPluginInstance } from "src/plugins/axios.js";

export default class CreateSimplePaymentAction
  extends BaseAction
  implements Action
{
  private readonly axios: AxiosPluginInstance;
  private readonly prismaClient: PrismaClient;
  constructor({ axios, prismaClient }: Cradle) {
    super();
    this.axios = axios;
    this.prismaClient = prismaClient;
  }

  public async execute(params: {
    reservationId: string;
    amount: number;
    paymentType: string;
    paymentDetails: {
      merchantId?: string;
      terminalId?: string;
      authorizationCode?: string;
    };
  }) {
    const reservation = await this.prismaClient.reservation.findUnique({
      where: {
        reservationId: params.reservationId,
      },
    });
    if (!reservation) {
      return {
        success: false,
        message: "Reservation not found",
      };
    }
    const jsonObj = {
      "soap:Envelope": {
        "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        "soap:Body": {
          insertPrebookingPaymentSimple: {
            "@_xmlns": "http://www.designa.de/",
            user: axiosConfig.user,
            pwd: axiosConfig.password,
            reservationId: String(reservation.reservationId),
            payDate: new Date().toISOString(),
            amount: params.amount.toString(),
            taxRate: "190",
            payType: params.paymentType,
            CCMerchantId: params.paymentDetails.merchantId || "",
            CCAuthCode: params.paymentDetails.authorizationCode || "",
          },
        },
      },
    };

    const xmlString = this.jsonToXml(jsonObj);

    try {
      await this.axios.post("", xmlString, {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: `"http://www.designa.de/insertPrebookingPaymentSimple"`,
          Accept: "text/xml",
        },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          "Unable to create reservation payment to a system error. Please try again later.",
        error: error,
      };
    }
  }
}

declare module "@app-types/app.js" {
  interface ActionTypes {
    CreateSimplePaymentAction: CreateSimplePaymentAction;
  }
}
