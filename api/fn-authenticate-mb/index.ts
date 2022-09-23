import container from "../container";
import createHandler from "../helpers/createHandler";
import User from "../model/User";
import UserRepository from "../repository/UserRepository";

export default createHandler(async (_, req) => {
  const { id, username } = req.user!;

  const user = await container
    .get(UserRepository)
    .getOrCreate(id, new User({ id, username }));

  const nonce = req.query["nonce"];
  if (!nonce) throw new Error("Nonce was not specified!");

  return {
    status: 302,
    headers: {
      location: `${process.env.MERCEDES_BENZ_AUTH_URL}&state=${nonce}`,
    },
  };
});
