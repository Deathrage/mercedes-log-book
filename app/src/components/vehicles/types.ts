export interface Vehicle {
  id: string;
  license?: string;
  model?: string;
}

export interface VehiclesContext {
  get loading(): boolean;
  get vehicles(): Vehicle[];
  get activeVehicle(): Vehicle | null;
  setActiveVehicle(id: string): void;
  reload: () => Promise<void>;
}
