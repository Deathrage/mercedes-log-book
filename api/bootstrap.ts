import { OpenAPI } from "./services/mercedes";

/**
 * Code required to be run before each invocation goes here
 */
export const bootstrap = () => {
  OpenAPI.BASE = "https://api.mercedes-benz.com/vehicledata_tryout/v2";
};
