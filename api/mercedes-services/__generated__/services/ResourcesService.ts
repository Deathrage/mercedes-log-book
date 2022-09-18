/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourceMetaInfo } from '../models/ResourceMetaInfo';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ResourcesService {

  /**
   * Returns all available resources for the provided vehicle identification number.
   * @param vehicleId Vehicle identification number
   * @returns ResourceMetaInfo OK
   * @throws ApiError
   */
  public static getAllResourcesForVinUsingGet(
vehicleId: string,
): CancelablePromise<Array<ResourceMetaInfo>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/vehicles/{vehicleId}/resources',
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
