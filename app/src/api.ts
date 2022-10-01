import { useCallback, useRef, useState } from "react";
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
import RidesSummaryData, {
  schema as RidesSummaryDataSchema,
} from "../../api/model-shared/RidesSummaryData";
import { useErrorsContext } from "./components/errors/hooks";
import { tryParseJson } from "./helpers/parsers";
import CoordinatesData from "../../api/model-shared/Coordinates";

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
    fetch(api.vehicle(request.vin), { method: "DELETE" }).then(),
  getVehicleStatus: (request: { vin: string }) =>
    fetchJson<VehicleStatusData>(
      api.vehicleStatus(request.vin),
      VehicleStatusSchema.parse
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
  getRidesSummary: (request: { vehicleId: string }) =>
    fetchJson<RidesSummaryData>(
      api.ridesSummary(request.vehicleId),
      RidesSummaryDataSchema.parse
    ),
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
};

export const useApi = <Request, Response>(
  pick: (list: typeof endpoints) => (request: Request) => Promise<Response>
) => {
  const { show } = useErrorsContext();

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

          show(error);
          reject(error);
        }
      }),
    [endpoint, show]
  );

  return { ...state, invoke, reset };
};
