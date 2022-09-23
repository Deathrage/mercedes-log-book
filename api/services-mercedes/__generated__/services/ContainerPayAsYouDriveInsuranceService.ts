/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ContainerPayAsYouDriveInsuranceService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Returns all resources for the container 'insurance', data can be filtered for a certain time range.
   * @param vehicleId Vehicle identification number
   * @returns any OK
   * @throws ApiError
   */
  public getResourcesForContainerIdUsingGet2(
vehicleId: string,
): CancelablePromise<Array<{
odo?: Resource;
}>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/vehicles/{vehicleId}/containers/payasyoudrive',
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
