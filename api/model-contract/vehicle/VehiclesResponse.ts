import VehicleResponse from "./VehicleResponse";

export default interface VehiclesResponse {
  vehicles: VehicleResponse[];
  count: number;
}
