/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvStatus } from '../models/EvStatus';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContainerElectricVehicleStatusService {

  /**
   * Returns all resources for the provided 'electricvehicle', data can be filtered for a certain time range.
   * @returns EvStatus OK
   * @throws ApiError
   */
  public static getResourcesForContainerIdUsingGet({
vehicleId,
}: {
/**
 * Vehicle identification number
 */
vehicleId: string,
}): CancelablePromise<Array<EvStatus>> {
    return __request(OpenAPI, {
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
