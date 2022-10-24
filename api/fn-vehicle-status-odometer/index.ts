import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import VehicleStatusOdometerData from "../model-shared/VehicleStatusOdometerData";
import VehicleOdometerStatusService from "../services-mercedes/VehicleOdometerStatusService";

@injectable()
class VehicleStatusOdometerHandler implements HttpRequestHandler {
  constructor(odometer: VehicleOdometerStatusService) {
    this.#odometer = odometer;
  }

  async handle({
    params: { id: vehicleId },
    user,
  }: HttpRequest): Promise<HttpResponse> {
    const userId = user!.username;

    const odometer = await this.#odometer.get(vehicleId, userId);

    const body: VehicleStatusOdometerData | undefined = odometer?.distance
      ? {
          value: odometer.distance.value,
          date: new Date(odometer.distance.timestamp!),
        }
      : undefined;

    return {
      body,
    };
  }

  #odometer: VehicleOdometerStatusService;
}

export default createHttpRequestHandler(VehicleStatusOdometerHandler, false);
