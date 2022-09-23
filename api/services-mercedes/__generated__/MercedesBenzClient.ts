/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { NodeHttpRequest } from './core/NodeHttpRequest';

import { ContainerElectricVehicleStatusService } from './services/ContainerElectricVehicleStatusService';
import { ContainerFuelStatusService } from './services/ContainerFuelStatusService';
import { ContainerPayAsYouDriveInsuranceService } from './services/ContainerPayAsYouDriveInsuranceService';
import { ContainerVehicleLockStatusService } from './services/ContainerVehicleLockStatusService';
import { ContainerVehicleStatusService } from './services/ContainerVehicleStatusService';
import { ConvertibleRoofTopResourceService } from './services/ConvertibleRoofTopResourceService';
import { DecklidResourceService } from './services/DecklidResourceService';
import { DoorLockDeckLidStatusResourceService } from './services/DoorLockDeckLidStatusResourceService';
import { DoorLockGasStatusResourceService } from './services/DoorLockGasStatusResourceService';
import { DoorLockStatusResourceService } from './services/DoorLockStatusResourceService';
import { FrontLeftDoorResourceService } from './services/FrontLeftDoorResourceService';
import { FrontLeftReadingLampResourceService } from './services/FrontLeftReadingLampResourceService';
import { FrontLeftWindowsResourceService } from './services/FrontLeftWindowsResourceService';
import { FrontRightDoorResourceService } from './services/FrontRightDoorResourceService';
import { FrontRightReadingLampResourceService } from './services/FrontRightReadingLampResourceService';
import { FrontRightWindowsResourceService } from './services/FrontRightWindowsResourceService';
import { InteriorFrontLightResourceService } from './services/InteriorFrontLightResourceService';
import { InteriorRearLightResourceService } from './services/InteriorRearLightResourceService';
import { LightSwitchPositionResourceService } from './services/LightSwitchPositionResourceService';
import { OdometerResourceService } from './services/OdometerResourceService';
import { PositionHeadingResourceService } from './services/PositionHeadingResourceService';
import { RangeElectricResourceService } from './services/RangeElectricResourceService';
import { RangeLiquidResourceService } from './services/RangeLiquidResourceService';
import { RearLeftDoorResourceService } from './services/RearLeftDoorResourceService';
import { RearLeftWindowsResourceService } from './services/RearLeftWindowsResourceService';
import { RearRightDoorResourceService } from './services/RearRightDoorResourceService';
import { RearRightWindowsResourceService } from './services/RearRightWindowsResourceService';
import { ResourcesService } from './services/ResourcesService';
import { StateOfChargeResourceService } from './services/StateOfChargeResourceService';
import { SunroofResourceService } from './services/SunroofResourceService';
import { TankLevelResourceService } from './services/TankLevelResourceService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class MercedesBenzClient {

  public readonly containerElectricVehicleStatus: ContainerElectricVehicleStatusService;
  public readonly containerFuelStatus: ContainerFuelStatusService;
  public readonly containerPayAsYouDriveInsurance: ContainerPayAsYouDriveInsuranceService;
  public readonly containerVehicleLockStatus: ContainerVehicleLockStatusService;
  public readonly containerVehicleStatus: ContainerVehicleStatusService;
  public readonly convertibleRoofTopResource: ConvertibleRoofTopResourceService;
  public readonly decklidResource: DecklidResourceService;
  public readonly doorLockDeckLidStatusResource: DoorLockDeckLidStatusResourceService;
  public readonly doorLockGasStatusResource: DoorLockGasStatusResourceService;
  public readonly doorLockStatusResource: DoorLockStatusResourceService;
  public readonly frontLeftDoorResource: FrontLeftDoorResourceService;
  public readonly frontLeftReadingLampResource: FrontLeftReadingLampResourceService;
  public readonly frontLeftWindowsResource: FrontLeftWindowsResourceService;
  public readonly frontRightDoorResource: FrontRightDoorResourceService;
  public readonly frontRightReadingLampResource: FrontRightReadingLampResourceService;
  public readonly frontRightWindowsResource: FrontRightWindowsResourceService;
  public readonly interiorFrontLightResource: InteriorFrontLightResourceService;
  public readonly interiorRearLightResource: InteriorRearLightResourceService;
  public readonly lightSwitchPositionResource: LightSwitchPositionResourceService;
  public readonly odometerResource: OdometerResourceService;
  public readonly positionHeadingResource: PositionHeadingResourceService;
  public readonly rangeElectricResource: RangeElectricResourceService;
  public readonly rangeLiquidResource: RangeLiquidResourceService;
  public readonly rearLeftDoorResource: RearLeftDoorResourceService;
  public readonly rearLeftWindowsResource: RearLeftWindowsResourceService;
  public readonly rearRightDoorResource: RearRightDoorResourceService;
  public readonly rearRightWindowsResource: RearRightWindowsResourceService;
  public readonly resources: ResourcesService;
  public readonly stateOfChargeResource: StateOfChargeResourceService;
  public readonly sunroofResource: SunroofResourceService;
  public readonly tankLevelResource: TankLevelResourceService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = NodeHttpRequest) {
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
    this.containerVehicleLockStatus = new ContainerVehicleLockStatusService(this.request);
    this.containerVehicleStatus = new ContainerVehicleStatusService(this.request);
    this.convertibleRoofTopResource = new ConvertibleRoofTopResourceService(this.request);
    this.decklidResource = new DecklidResourceService(this.request);
    this.doorLockDeckLidStatusResource = new DoorLockDeckLidStatusResourceService(this.request);
    this.doorLockGasStatusResource = new DoorLockGasStatusResourceService(this.request);
    this.doorLockStatusResource = new DoorLockStatusResourceService(this.request);
    this.frontLeftDoorResource = new FrontLeftDoorResourceService(this.request);
    this.frontLeftReadingLampResource = new FrontLeftReadingLampResourceService(this.request);
    this.frontLeftWindowsResource = new FrontLeftWindowsResourceService(this.request);
    this.frontRightDoorResource = new FrontRightDoorResourceService(this.request);
    this.frontRightReadingLampResource = new FrontRightReadingLampResourceService(this.request);
    this.frontRightWindowsResource = new FrontRightWindowsResourceService(this.request);
    this.interiorFrontLightResource = new InteriorFrontLightResourceService(this.request);
    this.interiorRearLightResource = new InteriorRearLightResourceService(this.request);
    this.lightSwitchPositionResource = new LightSwitchPositionResourceService(this.request);
    this.odometerResource = new OdometerResourceService(this.request);
    this.positionHeadingResource = new PositionHeadingResourceService(this.request);
    this.rangeElectricResource = new RangeElectricResourceService(this.request);
    this.rangeLiquidResource = new RangeLiquidResourceService(this.request);
    this.rearLeftDoorResource = new RearLeftDoorResourceService(this.request);
    this.rearLeftWindowsResource = new RearLeftWindowsResourceService(this.request);
    this.rearRightDoorResource = new RearRightDoorResourceService(this.request);
    this.rearRightWindowsResource = new RearRightWindowsResourceService(this.request);
    this.resources = new ResourcesService(this.request);
    this.stateOfChargeResource = new StateOfChargeResourceService(this.request);
    this.sunroofResource = new SunroofResourceService(this.request);
    this.tankLevelResource = new TankLevelResourceService(this.request);
  }
}
