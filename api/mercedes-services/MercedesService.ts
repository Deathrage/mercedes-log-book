import { OpenAPI } from "./__generated__";

let initialized = false;
const tryInitializeMercedesServices = () => {
  if (initialized) return;
  initialized = true;

  OpenAPI.BASE = "https://api.mercedes-benz.com/vehicledata_tryout/v2";
};

export class MercedesService {
  constructor() {
    tryInitializeMercedesServices();
  }
}
