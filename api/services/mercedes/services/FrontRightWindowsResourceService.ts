/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FrontRightWindowsResourceService {

  /**
   * Returns the latest available resource for the front right window status and vehicle identification number.
   * @returns any OK
   * @throws ApiError
   */
  public static getLatestWindowStatusFrontRightUsingGet({
vehicleId,
}: {
/**
 * Vehicle identification number
 */
vehicleId: string,
}): CancelablePromise<{
windowstatusfrontright?: Resource;
}> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/vehicles/{vehicleId}/resources/windowstatusfrontright',
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
