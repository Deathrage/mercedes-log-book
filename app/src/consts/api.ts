const api = {
  currentUser: "/api/current-user",
  mercedesAuth: "/api/.mb-auth",
  vehicles: "/api/vehicles",
  vehicle: (vin?: string) => `/api/vehicle${vin ? `/${vin}` : ""}`,
  vehicleStatus: (vin: string) => `/api/vehicle/${vin}/status`,
};

export default api;
