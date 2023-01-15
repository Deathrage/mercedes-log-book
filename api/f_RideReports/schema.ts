export const GET = {
  path: (vehicleId: string, dates: { from: Date; to: Date }) =>
    `ride-reports/${vehicleId}/xlsx?from=${dates.from.toJSON()}&to=${dates.to.toJSON()}`,
};
