/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourceMetaInfo } from '../models/ResourceMetaInfo';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ResourcesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns all available resources for the provided vehicle identification number.
   * @param vehicleId Vehicle identification number
   * @returns ResourceMetaInfo OK
   * @throws ApiError
   */
  public getAllResourcesForVinUsingGet(
vehicleId: string,
): CancelablePromise<Array<ResourceMetaInfo>> {
    return this.httpRequest.request({
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
