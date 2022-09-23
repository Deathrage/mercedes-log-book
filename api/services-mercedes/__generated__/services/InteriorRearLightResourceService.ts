/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class InteriorRearLightResourceService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns the latest available resource for the interior rear lights and vehicle identification number.
   * @param vehicleId Vehicle identification number
   * @returns any OK
   * @throws ApiError
   */
  public getLatestInteriorRearLightsUsingGet(
vehicleId: string,
): CancelablePromise<{
interiorLightsRear?: Resource;
}> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/vehicles/{vehicleId}/resources/interiorLightsRear',
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
