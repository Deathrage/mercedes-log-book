/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TankLevelResourceService {

  /**
   * Returns the latest available tank level resource for the vehicle identification number.
   * @returns any OK
   * @throws ApiError
   */
  public static getLatestTankLevelUsingGet({
vehicleId,
}: {
/**
 * Vehicle identification number
 */
vehicleId: string,
}): CancelablePromise<{
tanklevelpercent?: Resource;
}> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/vehicles/{vehicleId}/resources/tanklevelpercent',
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
