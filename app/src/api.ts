import { useCallback, useState } from "react";
import fetchJson from "./helpers/fetchJson";
import api from "./consts/api";
import {
  PostVehicleRequest,
  UserResponse,
  VehicleResponse,
  VehiclesResponse,
} from "../../api/contracts";

const endpoints = {
  getCurrentUser: () =>
    fetchJson<UserResponse.Type>(api.currentUser).then(
      UserResponse.schema.parse
    ),
  getVehicles: () =>
    fetchJson<VehiclesResponse.Type>(api.vehicles).then(
      VehiclesResponse.schema.parse
    ),
  getVehicle: (request: { vin: string }) =>
    fetchJson<VehicleResponse.Type>(api.vehicle(request.vin)).then(
      VehicleResponse.schema.parse
    ),
  postVehicle: (request: PostVehicleRequest.Type) =>
    fetchJson<VehicleResponse.Type>(api.vehicle(), "POST", request).then(
      VehicleResponse.schema.parse
    ),
  deleteVehicle: (request: { vin: string }) =>
    fetchJson<VehicleResponse.Type>(api.vehicle(request.vin), "DELETE").then(
      VehicleResponse.schema.parse
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
