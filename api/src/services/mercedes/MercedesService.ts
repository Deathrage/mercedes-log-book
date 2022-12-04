import { MercedesBenzClient } from "./__generated__";
import MercedesOidc from "./MercedesOidc";
import { injectable } from "inversify";
import AsyncLock from "async-lock";

const lock = new AsyncLock();

@injectable()
export default abstract class MercedesService<Result> {
  constructor(oidc: MercedesOidc) {
    this.#oidc = oidc;
  }

  async get(vehicleId: string, userId: string) {
    // As tokens are firstly read from DB and then sometimes refreshed unwanted concurrency may appear
    // when one task is already waiting for refresh request while other task is reading "old" expired tokens from DB
    // which will lead to another refresh request but with an old refresh token (single use) and subsequent throw.
    const accessToken = await lock.acquire<string>(userId, () =>
      this.#oidc.getStoredAccessToken(userId)
    );

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
  ): Promise<Result | null>;

  #oidc: MercedesOidc;
}
