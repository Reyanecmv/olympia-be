import { XMLBuilder, XMLParser } from "fast-xml-parser";

export abstract class BaseAction {
  protected readonly xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: false,
      parseTagValue: false,
    });
  }

  protected jsonToXml(jsonObj: unknown) {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      processEntities: false,
      suppressEmptyNode: false,
    });

    return `<?xml version="1.0" encoding="utf-8"?>\n ${builder.build(jsonObj)}`;
  }

  /**
   * Parse SOAP fault to extract error code and details
   */
  protected parseSoapFault(soapResponse: string): {
    errorCode: number;
    faultString: string;
  } {
    try {
      const parsed = this.xmlParser.parse(soapResponse);

      // Navigate to the Fault element
      const fault =
        parsed?.["soapenv:Envelope"]?.["soapenv:Body"]?.["soapenv:Fault"];

      if (!fault) {
        return { errorCode: -1, faultString: "Unknown SOAP error" };
      }

      // Extract error details
      const faultString = fault.faultstring || "Unknown error";

      // Try to extract the ErrorNumber from the detail element
      const detail = fault.detail || {};
      const errorCode = parseInt(
        detail.ErrorNumber || detail.errorNumber || "-1",
        10,
      );

      return { errorCode, faultString };
    } catch (err) {
      return { errorCode: -1, faultString: "Failed to parse SOAP error" };
    }
  }
}
