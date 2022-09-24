import { useCallback, useState } from "react";
import fetchJson from "./helpers/fetchJson";
import UserResponse from "../../api/model-contract/UserResponse";
import VehiclesResponse from "../../api/model-contract/vehicle/VehiclesResponse";
import PostVehicleRequest from "../../api/model-contract/vehicle/PostVehicleRequest";
import VehicleResponse from "../../api/model-contract/vehicle/VehicleResponse";
import api from "./consts/api";

const endpoints = {
  getCurrentUser: () => fetchJson<UserResponse>(api.currentUser),
  getVehicles: () => Promise.reject<VehiclesResponse>(api.vehicle),
  getVehicle: (request: { vin: string }) =>
    fetchJson<VehicleResponse>(api.vehicle(request.vin)),
  postVehicle: (request: PostVehicleRequest) =>
    fetchJson<VehicleResponse>(api.vehicle(), "POST", request),
  deleteVehicle: (request: { vin: string }) =>
    fetchJson<VehicleResponse>(api.vehicle(request.vin)),
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
