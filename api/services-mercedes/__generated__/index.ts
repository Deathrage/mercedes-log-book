/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { MercedesBenzClient } from './MercedesBenzClient';

export { ApiError } from './core/ApiError';
export { BaseHttpRequest } from './core/BaseHttpRequest';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { EvStatus } from './models/EvStatus';
export type { ExVeError } from './models/ExVeError';
export type { FuelStatus } from './models/FuelStatus';
export type { Resource } from './models/Resource';
export type { ResourceMetaInfo } from './models/ResourceMetaInfo';

export { ContainerElectricVehicleStatusService } from './services/ContainerElectricVehicleStatusService';
export { ContainerFuelStatusService } from './services/ContainerFuelStatusService';
export { ContainerPayAsYouDriveInsuranceService } from './services/ContainerPayAsYouDriveInsuranceService';
export { OdometerResourceService } from './services/OdometerResourceService';
export { RangeElectricResourceService } from './services/RangeElectricResourceService';
export { RangeLiquidResourceService } from './services/RangeLiquidResourceService';
export { ResourcesService } from './services/ResourcesService';
export { StateOfChargeResourceService } from './services/StateOfChargeResourceService';
export { TankLevelResourceService } from './services/TankLevelResourceService';
