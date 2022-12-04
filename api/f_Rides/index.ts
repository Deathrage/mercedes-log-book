import { injectable } from "inversify";
import { assertVehicleOwner } from "../src/helpers/assert";
import { createHttpHandler } from "../src/http";
import HttpHandler from "../src/http/HttpHandler";
import HttpRequest from "../src/http/HttpRequest";
import HttpResponse from "../src/http/HttpResponse";
import Ride from "../src/model/entities/Ride";
import RidesRepository from "../src/repository/RidesRepository";
import VehicleRepository from "../src/repository/VehicleRepository";
import { POST, PUT, GET_ONE, GET_LIST } from "./schema";
import extend from "just-extend";
import { z } from "zod";

const assertVehicleDidNotChange = (
  old: { vehicleId: string },
  _new: { vehicleId: string }
) => {
  if (old.vehicleId != _new.vehicleId)
    throw new Error(
      `Cannot change vehicle from ${old.vehicleId} to ${_new.vehicleId}!`
    );
};

@injectable()
class RideHandler extends HttpHandler {
  constructor(
    repository: RidesRepository,
    vehicleRepository: VehicleRepository
  ) {
    super();
    this.#repository = repository;
    this.#vehicleRepository = vehicleRepository;
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    const vehicleId = req.params.required.vehicleId;
    const userId = req.userId.required;
    assertVehicleOwner(await this.#getVehicle(vehicleId, userId), userId);

    const id = req.params.optional.id;
    if (id)
      return {
        body: await this.#getOne(id, vehicleId),
      };

    const page = Number(req.query.required.page);
    const pageSize = Number(req.query.required.pageSize);

    return {
      body: await this.#getMany(vehicleId, page, pageSize),
    };
  }

  async post(req: HttpRequest): Promise<HttpResponse> {
    const data = POST.request.parse(req.body);

    assertVehicleOwner(
      await this.#getVehicle(data.vehicleId, req.userId.required),
      req.userId.required
    );

    const ride = new Ride();
    extend(ride, data);
    ride.validate();

    await this.#repository.createOrUpdate(ride);

    return {
      body: POST.response.parse(ride),
    };
  }

  async put(req: HttpRequest): Promise<HttpResponse> {
    const data = PUT.request.parse(req.body);

    assertVehicleOwner(
      await this.#getVehicle(data.vehicleId, req.userId.required),
      req.userId.required
    );

    const ride = await this.#repository.getRequired(data.id, data.vehicleId);
    assertVehicleDidNotChange(ride, data);

    extend(ride, data);
    ride.validate();

    await this.#repository.createOrUpdate(ride);

    return {
      body: PUT.response.parse(ride),
    };
  }

  async delete(req: HttpRequest): Promise<HttpResponse> {
    assertVehicleOwner(
      await this.#getVehicle(
        req.params.required.vehicleId,
        req.userId.required
      ),
      req.userId.required
    );

    await this.#repository.delete(
      req.params.required.id,
      req.params.required.vehicleId
    );

    return {};
  }

  #repository: RidesRepository;
  #vehicleRepository: VehicleRepository;

  async #getOne(
    id: string,
    vehicleId: string
  ): Promise<z.infer<typeof GET_ONE.response>> {
    const ride = await this.#repository.getRequired(id, vehicleId);
    return GET_ONE.response.parse(ride);
  }

  async #getMany(
    vehicleId: string,
    page: number,
    pageSize: number
  ): Promise<z.infer<typeof GET_LIST.response>> {
    const rides = await this.#repository.paginatedFromLatest(
      vehicleId,
      pageSize * page,
      pageSize + 1
    );
    const hasMore = rides.length > pageSize;

    return GET_LIST.response.parse({
      hasMore,
      rides: rides.slice(0, pageSize),
    });
  }

  async #getVehicle(vehicleId: string, userId: string) {
    return this.#vehicleRepository.getRequired(vehicleId, userId);
  }
}

export default createHttpHandler(RideHandler);
