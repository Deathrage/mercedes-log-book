import { useCallback, useState } from "react";
import fetchJson from "./helpers/fetchJson";
import api from "./consts/api";
import PublicUserData, {
  schema as PublicUser,
} from "../../api/model-shared/PublicUserData";
import VehicleData, {
  schema as VehicleSchema,
} from "../../api/model-shared/VehicleData";
import VehiclesData, {
  schema as VehiclesSchema,
} from "../../api/model-shared/VehiclesData";

const endpoints = {
  getCurrentUser: () =>
    fetchJson<PublicUserData>(api.currentUser, PublicUser.parse),
  getVehicles: () =>
    fetchJson<VehiclesData>(api.vehicles, VehiclesSchema.parse),
  getVehicle: (request: { vin: string }) =>
    fetchJson<VehicleData>(api.vehicle(request.vin), VehicleSchema.parse),
  postVehicle: (request: VehicleData) =>
    fetchJson<VehicleData>(api.vehicle(), VehicleSchema.parse, "POST", request),
  deleteVehicle: (request: { vin: string }) =>
    fetchJson<VehicleData>(
      api.vehicle(request.vin),
      VehicleSchema.parse,
      "DELETE"
    ),
};

export const useApi = <Request, Response>(
  pick: (list: typeof endpoints) => (request: Request) => Promise<Response>
) => {
  const endpoint = pick(endpoints);

  const [state, setState] = useState<{
    running: boolean;
    data: Response | null;
    error: unknown | null;
  }>({
    running: false,
    data: null,
    error: null,
  });

  const invoke = useCallback(
    async (request: Request) => {
      setState({ running: true, data: null, error: null });
      try {
        const response = (await endpoint(request)) as Response;
        setState({ running: false, data: response, error: null });
        return response;
      } catch (error) {
        setState({ running: false, data: null, error });
        throw error;
      }
    },
    [endpoint]
  );

  return { ...state, invoke };
};
