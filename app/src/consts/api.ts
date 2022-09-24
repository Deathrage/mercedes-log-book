const api = {
  currentUser: "/api/current-user",
  mercedesAuth: "/api/.mb-ath",
  vehicles: "/api/vehicles",
  vehicle: (vin?: string) => `/api/vehicle${vin ? `/${vin}` : ""}`,
};

export default api;
