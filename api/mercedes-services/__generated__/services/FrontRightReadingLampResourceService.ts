/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FrontRightReadingLampResourceService {

  /**
   * Returns the latest available resource for the front right reading lamp and vehicle identification number.
   * @param vehicleId Vehicle identification number
   * @returns any OK
   * @throws ApiError
   */
  public static getLatestReadingLampFrontRightUsingGet(
vehicleId: string,
): CancelablePromise<{
readingLampFrontRight?: Resource;
}> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/vehicles/{vehicleId}/resources/readingLampFrontRight',
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