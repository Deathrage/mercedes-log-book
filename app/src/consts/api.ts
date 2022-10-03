const api = {
  currentUser: "/api/current-user",
  mercedesAuth: "/api/.mb-auth",
  vehicles: "/api/vehicles",
  vehicle: (vehicleId?: string) =>
    `/api/vehicle${vehicleId ? `/${vehicleId}` : ""}`,
  vehicleStatus: (vehicleId: string) => `/api/vehicle/${vehicleId}/status`,
  ride: (vehicleId?: string, id?: string) =>
    `/api/ride${vehicleId && id ? `/${vehicleId}/${id}` : ""}`,
  rides: (vehicleId: string, pageSize: number, page: number) =>
    `/api/rides/${vehicleId}/${pageSize}/${page}`,
  ridesSummary: (vehicleId: string) => `/api/rides/${vehicleId}/summary`,
  vehicleRide: (vehicleId: string) => `/api/vehicle/${vehicleId}/ride`,
  vehicleRideBegin: (vehicleId: string) =>
    `/api/vehicle/${vehicleId}/ride/begin`,
  vehicleRideFinish: (vehicleId: string) =>
    `/api/vehicle/${vehicleId}/ride/finish`,
  vehicleRideCancel: (vehicleId: string) =>
    `/api/vehicle/${vehicleId}/ride/cancel`,
};

export default api;
