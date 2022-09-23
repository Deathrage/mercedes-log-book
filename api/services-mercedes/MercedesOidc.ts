import { injectable } from "inversify";
import { Issuer, Client, TokenSet } from "openid-client";
import UserRepository from "../repository/UserRepository";
import { v4 as uuidv4 } from "uuid";
import User from "../model/User";

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

const scopes = [
  "offline_access",
  "mb:vehicle:mbdata:evstatus",
  "mb:vehicle:mbdata:fuelstatus",
  "mb:vehicle:mbdata:payasyoudrive",
  "mb:vehicle:mbdata:vehiclelock",
  "mb:vehicle:mbdata:vehiclestatus",
];

@injectable()
export default class MercedesOidc {
  constructor(repository: UserRepository) {
    this.#repository = repository;
  }

  async beginAuthorization(userId: string): Promise<string> {
    await tryInitializeOidcClient();

    const user = await this.#repository.get(userId);
    user.mercedesBenzNonce = uuidv4();
    user.mercedesBenz = undefined;

    await this.#repository.createOrUpdate(user);

    const url = client.authorizationUrl({
      scope: scopes.join(" "),
      state: user.mercedesBenzNonce,
    });

    return url;
  }

  async finishAuthorization(userId: string, callbackUrl: string) {
    await tryInitializeOidcClient();

    const user = await this.#repository.get(userId);

    const nonce = user.mercedesBenzNonce;
    if (!nonce)
      throw new Error(
        `No Mercedes Benz authorization is ongoing for ${userId}!`
      );
    user.mercedesBenzNonce = undefined;
    // Immediately delete the nonce as if anything fails later on nonce wont be stored anymore and cannot be misused
    await this.#repository.createOrUpdate(user);

    const params = client.callbackParams(callbackUrl);
    const tokens = await client.oauthCallback(
      process.env.MERCEDES_BENZ_REDIRECT_URL,
      params,
      {
        state: nonce,
        response_type: "code",
      }
    );

    await this.#storeTokens(user, tokens);
  }

  async getStoredAccessToken(userId: string) {
    const user = await this.#repository.get(userId);

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

    const tokens = await client.refresh(user.mercedesBenz.refreshToken);
    const { access_token: accessToken } = await this.#storeTokens(user, tokens);

    return accessToken;
  }

  async #storeTokens(user: User, tokens: TokenSet): Promise<TokenSet> {
    const expiresAt = new Date();
    expiresAt.setUTCSeconds(expiresAt.getUTCSeconds() + tokens.expires_in!);

    if (user.mercedesBenzNonce) user.mercedesBenzNonce = undefined;
    user.mercedesBenz = {
      accessToken: {
        value: tokens.access_token!,
        expiresAt,
      },
      refreshToken: tokens.refresh_token!,
    };

    await this.#repository.createOrUpdate(user);

    return tokens;
  }

  #repository: UserRepository;
}
