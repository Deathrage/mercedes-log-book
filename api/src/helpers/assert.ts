import Vehicle from "../model/entities/Vehicle";

export const assertVehicleOwner = (vehicle: Vehicle, userId: string) => {
  if (vehicle.userId !== userId)
    throw new Error(`Vehicle ${vehicle.id} does not belong to user ${userId}!`);
};
