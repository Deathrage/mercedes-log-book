import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import TrackedRideService from "../services/TrackedRideService";

@injectable()
class CancelRideHandler implements HttpRequestHandler {
  constructor(service: TrackedRideService) {
    this.#service = service;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicleId = req.params.id;

    await this.#service.cancelRide(vehicleId, userId);

    return {};
  }

  #service: TrackedRideService;
}

export default createHttpRequestHandler(CancelRideHandler, false);
