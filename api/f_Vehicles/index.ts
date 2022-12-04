import { injectable } from "inversify";
import extend from "just-extend";
import { z } from "zod";
import { assertVehicleOwner } from "../src/helpers/assert";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import Vehicle from "../src/model/entities/Vehicle";
import VehicleRepository from "../src/repository/VehicleRepository";
import { GET_ONE, GET_ALL, POST, PUT } from "./schema";

@injectable()
class VehicleHandler extends HttpHandler {
  constructor(repository: VehicleRepository) {
    super();
    this.#repository = repository;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const id = req.params.optional.id;
    const userId = req.userId.required;

    if (id)
      return {
        body: await this.#getOne(id, userId),
      };

    return {
      body: await this.#getMany(userId),
    };
  }

  async post(req: HttpRequest): Promise<HttpResponse> {
    const data = POST.request.parse(req.body);

    const vehicle = new Vehicle();
    extend(vehicle, {
      ...data,
      userId: req.userId.required,
    });

    await this.#repository.createOrUpdate(vehicle);

    return {
      body: POST.response.parse(vehicle),
    };
  }

  async put(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.userId.required;
    const data = PUT.request.parse(req.body);

    const vehicle = await this.#repository.getRequired(data.id, userId);
    assertVehicleOwner(vehicle, userId);

    extend(vehicle, data);

    await this.#repository.createOrUpdate(vehicle);

    return {
      body: PUT.response.parse(vehicle),
    };
  }

  async delete(req: HttpRequest): Promise<HttpResponse> {
    const userId = req.userId.required;

    const vehicle = await this.#repository.getRequired(
      req.params.required.id,
      userId
    );

    assertVehicleOwner(vehicle, userId);

    await this.#repository.delete(vehicle.id, userId);

    return {};
  }

  #repository: VehicleRepository;

  async #getOne(
    id: string,
    userId: string
  ): Promise<z.infer<typeof GET_ONE.response>> {
    const vehicle = await this.#repository.getRequired(id, userId);

    assertVehicleOwner(vehicle, userId);

    return GET_ONE.response.parse(vehicle);
  }

  async #getMany(userId: string): Promise<z.infer<typeof GET_ALL.response>> {
    const vehicles = await this.#repository.getAll(userId);

    vehicles.forEach((vehicle) => assertVehicleOwner(vehicle, userId));

    return GET_ALL.response.parse(vehicles);
  }
}

export default createHttpHandler(VehicleHandler);
