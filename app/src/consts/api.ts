const api = {
  currentUser: "/api/current-user",
  mercedesAuth: "/api/.mb-auth",
  vehicles: "/api/vehicles",
  vehicle: (vin?: string) => `/api/vehicle${vin ? `/${vin}` : ""}`,
  vehicleStatus: (vin: string) => `/api/vehicle/${vin}/status`,
  ride: (vehicleId?: string, id?: string) =>
    `/api/ride${vehicleId && id ? `/${vehicleId}/${id}` : ""}`,
  rides: (vehicleId: string, pageSize: number, page: number) =>
    `/api/rides/${vehicleId}/${pageSize}/${page}`,
};

export default api;
