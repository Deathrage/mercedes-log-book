import { OpenAPI } from "./mercedes";

let initialized = false;

/**
 * Code required to be run before each invocation goes here
 */
export const tryBootstrap = () => {
  if (initialized) return;
  initialized = true;

  OpenAPI.BASE = "https://api.mercedes-benz.com/vehicledata_tryout/v2";
};
