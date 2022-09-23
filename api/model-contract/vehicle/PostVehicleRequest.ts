import PropulsionType from "../../model/PropulsionType";

export default interface PostVehicleRequest {
  vin: string;
  license: string;
  model: string;
  propulsion: PropulsionType;
}
