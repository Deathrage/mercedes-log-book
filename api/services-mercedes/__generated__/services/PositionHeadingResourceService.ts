/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PositionHeadingResourceService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns the latest available position heading resource for the provided vehicle identification number.
   * @param vehicleId Vehicle identification number
   * @returns any OK
   * @throws ApiError
   */
  public getLatestPositionHeadingUsingGet(
vehicleId: string,
): CancelablePromise<{
positionHeading?: Resource;
}> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/vehicles/{vehicleId}/resources/positionHeading',
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
