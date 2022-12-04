/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FuelStatus } from '../models/FuelStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ContainerFuelStatusService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns all resources for the provided 'fuelstatus', data can be filtered for a certain time range.
   * @param vehicleId Vehicle identification number
   * @returns FuelStatus OK
   * @throws ApiError
   */
  public getResourcesForContainerIdUsingGet1(
vehicleId: string,
): CancelablePromise<Array<FuelStatus>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/vehicles/{vehicleId}/containers/fuelstatus',
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
