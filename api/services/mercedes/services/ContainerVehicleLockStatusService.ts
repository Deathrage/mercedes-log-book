/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VehicleLockStatus } from '../models/VehicleLockStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContainerVehicleLockStatusService {

  /**
   * Returns all resources for the container 'vehiclelockstatus', data can be filtered for a certain time range.
   * @returns VehicleLockStatus OK
   * @throws ApiError
   */
  public static getResourcesForContainerIdUsingGet({
vehicleId,
}: {
/**
 * Vehicle identification number
 */
vehicleId: string,
}): CancelablePromise<Array<VehicleLockStatus>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/vehicles/{vehicleId}/containers/vehiclelockstatus',
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
