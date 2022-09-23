import { MercedesBenzClient } from "./__generated__";
import MercedesOidc from "./MercedesOidc";

export default abstract class MercedesService<Result> {
  constructor(oidc: MercedesOidc) {
    this.#oidc = oidc;
  }

  async get(vehicleId: string, userId: string) {
    const accessToken = this.#oidc.getStoredAccessToken(userId);

    return await this.execute(
      vehicleId,
      new MercedesBenzClient({
        HEADERS: {
          authorization: `Bearer ${accessToken}`,
        },
      })
    );
  }

  protected abstract execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<Result>;

  #oidc: MercedesOidc;
}
