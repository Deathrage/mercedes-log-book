/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { ContainerElectricVehicleStatusService } from './services/ContainerElectricVehicleStatusService';
import { ContainerFuelStatusService } from './services/ContainerFuelStatusService';
import { ContainerPayAsYouDriveInsuranceService } from './services/ContainerPayAsYouDriveInsuranceService';
import { OdometerResourceService } from './services/OdometerResourceService';
import { RangeElectricResourceService } from './services/RangeElectricResourceService';
import { RangeLiquidResourceService } from './services/RangeLiquidResourceService';
import { ResourcesService } from './services/ResourcesService';
import { StateOfChargeResourceService } from './services/StateOfChargeResourceService';
import { TankLevelResourceService } from './services/TankLevelResourceService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class MercedesBenzClient {

  public readonly containerElectricVehicleStatus: ContainerElectricVehicleStatusService;
  public readonly containerFuelStatus: ContainerFuelStatusService;
  public readonly containerPayAsYouDriveInsurance: ContainerPayAsYouDriveInsuranceService;
  public readonly odometerResource: OdometerResourceService;
  public readonly rangeElectricResource: RangeElectricResourceService;
  public readonly rangeLiquidResource: RangeLiquidResourceService;
  public readonly resources: ResourcesService;
  public readonly stateOfChargeResource: StateOfChargeResourceService;
  public readonly tankLevelResource: TankLevelResourceService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? 'https://api.mercedes-benz.com/vehicledata/v2',
      VERSION: config?.VERSION ?? '2.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.containerElectricVehicleStatus = new ContainerElectricVehicleStatusService(this.request);
    this.containerFuelStatus = new ContainerFuelStatusService(this.request);
    this.containerPayAsYouDriveInsurance = new ContainerPayAsYouDriveInsuranceService(this.request);
    this.odometerResource = new OdometerResourceService(this.request);
    this.rangeElectricResource = new RangeElectricResourceService(this.request);
    this.rangeLiquidResource = new RangeLiquidResourceService(this.request);
    this.resources = new ResourcesService(this.request);
    this.stateOfChargeResource = new StateOfChargeResourceService(this.request);
    this.tankLevelResource = new TankLevelResourceService(this.request);
  }
}
