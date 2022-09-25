import { HttpRequest, HttpResponse } from "@azure/functions";
import { injectable } from "inversify";
import { createHttpRequestHandler, HttpRequestHandler } from "../helpers/http";
import VehiclesData from "../model-shared/VehiclesData";
import VehicleRepository from "../repository/VehicleRepository";

@injectable()
class VehiclesHandler implements HttpRequestHandler {
  constructor(repository: VehicleRepository) {
    this.#repository = repository;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.user!.username;
    return {
      body: await this.#get(userId),
    };
  }

  async #get(userId: string): Promise<VehiclesData> {
    const vehicles = await this.#repository.getAll(userId);
    return vehicles;
  }

  #repository: VehicleRepository;
}

export default createHttpRequestHandler(VehiclesHandler, false);
