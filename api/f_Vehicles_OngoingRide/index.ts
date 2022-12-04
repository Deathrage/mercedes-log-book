import { injectable } from "inversify";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import TrackedRideService from "../src/services/TrackedRideService";
import { GET, POST } from "./schema";

@injectable()
class VehicleRideHandler extends HttpHandler {
  constructor(service: TrackedRideService) {
    super();
    this.#service = service;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const rideId = await this.#service.getCurrentRide(
      req.params.required.id,
      req.userId.required
    );

    return {
      body: GET.response.parse(rideId),
    };
  }

  async post(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.required.id;
    const userId = req.userId.required;

    const data = POST.request.parse(req.body);

    let rideId = await this.#service.getCurrentRide(
      req.params.required.id,
      req.userId.required
    );

    if (rideId)
      rideId = await this.#service.finishRide(data, vehicleId, userId);
    else rideId = await this.#service.beginRide(data, vehicleId, userId);

    return {
      body: POST.response.parse(rideId),
    };
  }

  async delete(req: HttpRequest): Promise<HttpResponse> {
    await this.#service.cancelRide(req.params.required.id, req.userId.required);

    return {};
  }

  #service: TrackedRideService;
}

export default createHttpHandler(VehicleRideHandler);
