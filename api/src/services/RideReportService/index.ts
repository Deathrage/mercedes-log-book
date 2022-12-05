import { injectable } from "inversify";
import RidesRepository from "../../repository/RidesRepository";
import { write, utils, WorkSheet } from "xlsx-js-style";
import VehicleRepository from "../../repository/VehicleRepository";
import { autosizeColumns, styleHeader, toRows } from "./helpers";
import { assertVehicleOwner } from "../../helpers/assert";

@injectable()
export default class RideReportService {
  constructor(
    ridesRepository: RidesRepository,
    ridesVehicle: VehicleRepository
  ) {
    this.#ridesRepository = ridesRepository;
    this.#ridesVehicle = ridesVehicle;
  }

  async generateXlsx(
    vehicleId: string,
    dates: { from: Date; to: Date },
    userId: string
  ): Promise<Buffer> {
    const vehicle = await this.#ridesVehicle.getRequired(vehicleId, userId);
    assertVehicleOwner(vehicle, userId);

    const rides = await this.#ridesRepository.betweenDates(vehicleId, dates);

    const rows = toRows(vehicle, rides);

    const book = utils.book_new();

    const sheet = utils.json_to_sheet(rows, {
      cellDates: true,
      dateNF: "dd.mm.yyy hh:mm:ss",
    });

    autosizeColumns(sheet);
    styleHeader(sheet);

    utils.book_append_sheet(book, sheet);

    const buffer: Buffer = write(book, { type: "buffer" });

    return buffer;
  }

  #ridesRepository: RidesRepository;
  #ridesVehicle: VehicleRepository;
}
