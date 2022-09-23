/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VehicleStatus } from '../models/VehicleStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ContainerVehicleStatusService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns all resources for the provided 'vehiclestatus', data can be filtered for a certain time range.
   * @param vehicleId Vehicle identification number
   * @returns VehicleStatus OK
   * @throws ApiError
   */
  public getResourcesForContainerIdUsingGet4(
vehicleId: string,
): CancelablePromise<Array<VehicleStatus>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/vehicles/{vehicleId}/containers/vehiclestatus',
      path: {
        'vehicleId': vehicleId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Resource not Found`,
        429: `The service received too many requests in a given amount of time.`,
        500: `Internal Server Error`,
        503: `Service Unavailable`,
      },
    });
  }

}
