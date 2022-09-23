import { MercedesBenzClient } from "./__generated__";
import { Issuer, Client } from "openid-client";
import UserRepository from "../repository/UserRepository";

let client: Client;
const tryInitializeOidcClient = async () => {
  if (!client) {
    const issuer = await Issuer.discover(process.env.MERCEDES_BENZ_ISSUER_URL);
    client = new issuer.Client({
      client_id: process.env.MERCEDES_BENZ_CLIENT_ID,
      client_secret: process.env.MERCEDES_BENZ_CLIENT_SECRET,
      response_types: ["code"],
      redirect_uris: [process.env.MERCEDES_BENZ_REDIRECT_URL],
    });
  }
};

export abstract class MercedesService<Result> {
  constructor(userRepository: UserRepository) {
    this.#userRepository = userRepository;
  }

  async get(vehicleId: string, userId: string) {
    const accessToken = this.#getAccessToken(userId);

    const client = new MercedesBenzClient({
      HEADERS: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return await this.execute(vehicleId, client);
  }

  protected abstract execute(
    vehicleId: string,
    client: MercedesBenzClient
  ): Promise<Result>;

  #userRepository: UserRepository;

  async #getAccessToken(userId: string) {
    const user = await this.#userRepository.get(userId);

    // Called should always prompt MB services login before using MB services
    if (!user.mercedesBenz)
      throw new Error(`User ${userId} is not connected to Mercedes Benz!`);

    if (
      user.mercedesBenz.accessToken &&
      user.mercedesBenz.accessToken.expiresAt.getTime() < new Date().getTime()
    )
      return user.mercedesBenz.accessToken.value;

    // Initialization of oidc client should happen as late as possible as most of the times users will have valid access token in DB.
    await tryInitializeOidcClient();

    const { access_token: newAccessToken, expires_in } = await client.refresh(
      user.mercedesBenz.refreshToken
    );

    const newExpiresAt = new Date();
    newExpiresAt.setUTCSeconds(newExpiresAt.getUTCSeconds() + expires_in!);

    user.mercedesBenz.accessToken = {
      value: newAccessToken!,
      expiresAt: newExpiresAt,
    };

    await this.#userRepository.upsert(user);

    return newAccessToken;
  }
}
