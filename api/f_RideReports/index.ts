import { injectable } from "inversify";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import RideReportService from "../src/services/RideReportService";
import { differenceInMonths, format } from "date-fns";

@injectable()
class ReportsHttpHandler extends HttpHandler {
  constructor(service: RideReportService) {
    super();
    this.#service = service;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.required.vehicleId;
    const from = new Date(req.query.required.from);
    const to = new Date(req.query.required.to);

    const difMonths = Math.abs(differenceInMonths(to, from));
    if (difMonths > 12)
      throw new Error(
        `Time span cannot be higher than 12, received ${difMonths}!`
      );

    const file = await this.#service.generateXlsx(
      vehicleId,
      { from, to },
      req.userId.required
    );

    return {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      body: file,
    };
  }

  #service: RideReportService;
}

export default createHttpHandler(ReportsHttpHandler);
