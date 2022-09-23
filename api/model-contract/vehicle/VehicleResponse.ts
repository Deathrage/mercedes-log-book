import PropulsionType from "../../model/PropulsionType";

export default interface VehicleResponse {
  vin: string;
  license: string;
  model: string;
  propulsion: PropulsionType;
}
