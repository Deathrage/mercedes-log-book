/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvStatus } from '../models/EvStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ContainerElectricVehicleStatusService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns all resources for the provided 'electricvehicle', data can be filtered for a certain time range.
   * @param vehicleId Vehicle identification number
   * @returns EvStatus OK
   * @throws ApiError
   */
  public getResourcesForContainerIdUsingGet(
vehicleId: string,
): CancelablePromise<Array<EvStatus>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/vehicles/{vehicleId}/containers/electricvehicle',
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
