import { useCallback, useRef, useState } from "react";
import fetchJson from "./helpers/fetchJson";
import api from "./consts/api";
import PublicUserData, {
  schema as PublicUser,
} from "../../api/model-shared/PublicUserData";
import AddressesData, {
  schema as AddressesSchema,
} from "../../api/model-shared/AddressesData";
import VehicleData, {
  schema as VehicleSchema,
} from "../../api/model-shared/VehicleData";
import VehiclesData, {
  schema as VehiclesSchema,
} from "../../api/model-shared/VehiclesData";
import VehicleStatusData, {
  schema as VehicleStatusSchema,
} from "../../api/model-shared/VehicleStatusData";
import RideData, {
  schema as RideDataSchema,
} from "../../api/model-shared/RideData";
import RidesData, {
  schema as RidesDataSchema,
} from "../../api/model-shared/RidesData";
import {
  MercedesBenzErrorType,
  schema as MercedesBenzErrorDataSchema,
} from "../../api/model-shared/MercedesBenzErrorData";
import VehicleStatusOdometerData, {
  schema as VehicleStatusOdometerDataSchema,
} from "../../api/model-shared/VehicleStatusOdometerData";
import { useErrorsContext } from "./components/errors/hooks";
import { tryParseJson } from "./helpers/parsers";
import CoordinatesData from "../../api/model-shared/Coordinates";

const endpoints = {
  getCurrentUser: () =>
    fetchJson<PublicUserData>(api.currentUser, PublicUser.parse),
  getCurrentUserAddresses: () =>
    fetchJson<AddressesData>(api.currentUser, AddressesSchema.parse),
  postCurrentUserAddresses: (request: AddressesData) =>
    fetchJson<AddressesData>(
      api.currentUser,
      AddressesSchema.parse,
      "POST",
      request
    ),
  getVehicles: () =>
    fetchJson<VehiclesData>(api.vehicles, VehiclesSchema.parse),
  getVehicle: (request: { vehicleId: string }) =>
    fetchJson<VehicleData>(api.vehicle(request.vehicleId), VehicleSchema.parse),
  postVehicle: (request: VehicleData) =>
    fetchJson<VehicleData>(api.vehicle(), VehicleSchema.parse, "POST", request),
  deleteVehicle: (request: { vehicleId: string }) =>
    fetch(api.vehicle(request.vehicleId), { method: "DELETE" }).then(),
  getVehicleStatus: (request: { vehicleId: string }) =>
    fetchJson<VehicleStatusData>(
      api.vehicleStatus(request.vehicleId),
      VehicleStatusSchema.parse
    ),
  getVehicleStatusOdometer: (request: { vehicleId: string }) =>
    fetchJson<VehicleStatusOdometerData>(
      api.vehicleStatusOdometer(request.vehicleId),
      VehicleStatusOdometerDataSchema.parse
    ),
  getRide: (request: { id: string; vehicleId: string }) =>
    fetchJson<RideData>(
      api.ride(request.vehicleId, request.id),
      RideDataSchema.parse
    ),
  postRide: (request: RideData) =>
    fetchJson<RideData>(api.ride(), RideDataSchema.parse, "POST", request),
  getRides: (request: { vehicleId: string; pageSize: number; page: number }) =>
    fetchJson<RidesData>(
      api.rides(request.vehicleId, request.pageSize, request.page),
      RidesDataSchema.parse
    ),
  deleteRide: (request: { id: string; vehicleId: string }) =>
    fetch(api.ride(request.vehicleId, request.id), { method: "DELETE" }).then(),
  getRidesSum: (request: { vehicleId: string }) =>
    fetch(api.ridesSum(request.vehicleId))
      .then((res) => res.text())
      .then(Number),
  getVehicleRide: (request: { vehicleId: string }): Promise<RideData | null> =>
    fetchJson<RideData | null>(
      api.vehicleRide(request.vehicleId),
      (response) => {
        if (!response) return null;
        return RideDataSchema.parse(response);
      }
    ),
  postVehicleRideBegin: (request: {
    vehicleId: string;
    body?: CoordinatesData;
  }) =>
    fetchJson<RideData>(
      api.vehicleRideBegin(request.vehicleId),
      RideDataSchema.parse,
      "POST",
      request.body
    ),
  postVehicleRideFinish: (request: {
    vehicleId: string;
    body?: CoordinatesData;
  }) =>
    fetchJson<RideData>(
      api.vehicleRideFinish(request.vehicleId),
      RideDataSchema.parse,
      "POST",
      request.body
    ),
  postVehicleRideCancel: (request: { vehicleId: string }) =>
    fetch(api.vehicleRideCancel(request.vehicleId), {
      method: "POST",
    }).then(),
};

export const useApi = <Request, Response>(
  pick: (list: typeof endpoints) => (request: Request) => Promise<Response>,
  config?: { silent?: boolean; defaultRunning?: boolean }
) => {
  const silent = config?.silent ?? false;
  const defaultRunning = config?.defaultRunning ?? false;

  const { show } = useErrorsContext();

  const endpoint = pick(endpoints);

  const [state, setState] = useState<{
    running: boolean;
    data: Response | null;
    error: unknown | null;
  }>({
    running: defaultRunning,
    data: null,
    error: null,
  });

  const abortHandler = useRef<() => void>();

  const reset = useCallback(() => {
    // Abort ongoing request if reset called
    abortHandler.current?.();
    setState({ running: false, data: null, error: null });
  }, []);

  const invoke = useCallback(
    (request: Request) =>
      new Promise<Response>(async (resolve, reject) => {
        // Abort already ongoing abort it
        abortHandler.current?.();
        abortHandler.current = () => {
          reject();
          abortHandler.current = undefined;
        };

        setState({ running: true, data: null, error: null });
        try {
          const response = (await endpoint(request)) as Response;
          setState({ running: false, data: response, error: null });

          resolve(response);
        } catch (error) {
          setState({ running: false, data: null, error });

          if (error instanceof Error) {
            const jsonResult = tryParseJson(error.message);
            if (jsonResult.success) {
              const result = MercedesBenzErrorDataSchema.safeParse(
                jsonResult.data
              );
              if (
                result.success &&
                result.data.type === MercedesBenzErrorType.INVALID_GRANT
              )
                window.location.href = api.mercedesAuth;
            }
          }

          if (!silent) show(error);
          reject(error);
        }
      }),
    [endpoint, show, silent]
  );

  return { ...state, invoke, reset };
};
