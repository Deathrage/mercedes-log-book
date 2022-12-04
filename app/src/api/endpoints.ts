import {
  CurrentUser,
  CurrentUserAddress,
  Vehicles,
  VehiclesStatus,
  VehiclesStatusOdometer,
  Rides,
  RidesSum,
  VehiclesOngoingRide,
} from "@shared/contracts";
import { z } from "zod";
import { fetchApiJson, fetchApiString, fetchApiVoid } from "./helpers";

const endpoints = {
  currentUser: () =>
    fetchApiJson(CurrentUser.GET.path, CurrentUser.GET.response.parse, "GET"),
  currentUserAddresses: () =>
    fetchApiJson(
      CurrentUserAddress.GET.path,
      CurrentUserAddress.GET.response.parse,
      "GET"
    ),
  saveCurrentUserAddresses: (
    addresses: z.infer<typeof CurrentUserAddress.PUT.request>
  ) =>
    fetchApiJson(
      CurrentUserAddress.PUT.path,
      CurrentUserAddress.PUT.response.parse,
      "PUT",
      CurrentUserAddress.PUT.request.parse(addresses)
    ),
  currentUserVehicles: () =>
    fetchApiJson(Vehicles.GET_ALL.path, Vehicles.GET_ALL.response.parse, "GET"),
  vehicle: (id: string) =>
    fetchApiJson(
      Vehicles.GET_ONE.path(id),
      Vehicles.GET_ONE.response.parse,
      "GET"
    ),
  createVehicle: (vehicle: z.infer<typeof Vehicles.POST.request>) =>
    fetchApiJson(
      Vehicles.POST.path,
      Vehicles.POST.response.parse,
      "POST",
      Vehicles.POST.request.parse(vehicle)
    ),
  updateVehicle: (vehicle: z.infer<typeof Vehicles.PUT.request>) =>
    fetchApiJson(
      Vehicles.PUT.path,
      Vehicles.PUT.response.parse,
      "PUT",
      Vehicles.PUT.request.parse(vehicle)
    ),
  deleteVehicle: (id: string) =>
    fetchApiVoid(Vehicles.DELETE.path(id), "DELETE"),
  vehicleStatus: (id: string) =>
    fetchApiJson(
      VehiclesStatus.GET.path(id),
      VehiclesStatus.GET.response.parse,
      "GET"
    ),
  vehicleOdometer: (id: string) =>
    fetchApiJson(
      VehiclesStatusOdometer.GET.path(id),
      VehiclesStatusOdometer.GET.response.parse,
      "GET"
    ),
  ride: ({ id, vehicleId }: { id: string; vehicleId: string }) =>
    fetchApiJson(
      Rides.GET_ONE.path(vehicleId, id),
      Rides.GET_ONE.response.parse,
      "GET"
    ),
  rides: ({
    vehicleId,
    pageSize,
    page,
  }: {
    vehicleId: string;
    pageSize: number;
    page: number;
  }) =>
    fetchApiJson(
      Rides.GET_LIST.path(vehicleId, pageSize, page),
      Rides.GET_LIST.response.parse,
      "GET"
    ),
  createRide: (request: z.infer<typeof Rides.POST.request>) =>
    fetchApiJson(
      Rides.POST.path,
      Rides.POST.response.parse,
      "POST",
      Rides.POST.request.parse(request)
    ),
  updateRide: (request: z.infer<typeof Rides.PUT.request>) =>
    fetchApiJson(
      Rides.PUT.path,
      Rides.PUT.response.parse,
      "PUT",
      Rides.PUT.request.parse(request)
    ),
  deleteRide: ({ id, vehicleId }: { id: string; vehicleId: string }) =>
    fetchApiVoid(Rides.DELETE.path(vehicleId, id), "DELETE"),
  ridesSum: (vehicleId: string) =>
    fetchApiJson(
      RidesSum.GET.path(vehicleId),
      RidesSum.GET.response.parse,
      "GET"
    ),
  ongoingRide: (vehicleId: string) =>
    fetchApiString<string | null>(
      VehiclesOngoingRide.GET.path(vehicleId),
      "GET"
    ),
  startStopOngoingRide: ({
    vehicleId,
    coordinates,
  }: {
    vehicleId: string;
    coordinates: z.infer<typeof VehiclesOngoingRide.POST.request>;
  }) =>
    fetchApiString<string>(
      VehiclesOngoingRide.POST.path(vehicleId),
      "POST",
      VehiclesOngoingRide.POST.request.parse(coordinates)
    ),
  cancelOngoingRide: (vehicleId: string) =>
    fetchApiVoid(VehiclesOngoingRide.DELETE.path(vehicleId), "DELETE"),
};

export default endpoints;
