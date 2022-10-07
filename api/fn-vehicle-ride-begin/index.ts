import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import { schema as CoordinatesSchema } from "../model-shared/Coordinates";
import { schema as RideDataSchema } from "../model-shared/RideData";
import TrackedRideService from "../services/TrackedRideService";

@injectable()
class BeginRideHandler implements HttpRequestHandler {
  constructor(service: TrackedRideService) {
    this.#service = service;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    const vehicleId = req.params.id;

    const ride = await this.#service.beginRide(
      req.body && CoordinatesSchema.parse(req.body),
      vehicleId,
      userId
    );

    return {
      body: RideDataSchema.parse(ride),
    };
  }

  #service: TrackedRideService;
}

export default createHttpRequestHandler(BeginRideHandler, false);
