import { injectable } from "inversify";
import { assertVehicleOwner } from "../src/helpers/assert";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import VehicleRepository from "../src/repository/VehicleRepository";
import VehicleOdometerStatusService from "../src/services/mercedes/VehicleOdometerStatusService";
import { GET } from "./schema";

@injectable()
class VehicleStatusOdometerHandler extends HttpHandler {
  constructor(
    repository: VehicleRepository,
    odometer: VehicleOdometerStatusService
  ) {
    super();
    this.#repository = repository;
    this.#odometer = odometer;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.required.id;
    const userId = req.userId.required;

    const vehicle = await this.#repository.getRequired(vehicleId, userId);
    assertVehicleOwner(vehicle, userId);

    const odometer = await this.#odometer.get(vehicleId, userId);

    const response = odometer?.distance
      ? {
          value: odometer.distance.value,
          date: new Date(odometer.distance.timestamp!),
        }
      : null;

    return {
      body: GET.response.parse(response),
    };
  }

  #odometer: VehicleOdometerStatusService;
  #repository: VehicleRepository;
}

export default createHttpHandler(VehicleStatusOdometerHandler);
