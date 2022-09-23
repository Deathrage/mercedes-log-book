import { HttpRequest } from "@azure/functions";
import container from "../container";
import createHandler from "../helpers/createHandler";
import UserResponse from "../model-contract/UserResponse";
import User from "../model/User";
import UserRepository from "../repository/UserRepository";

export default createHandler(async (_, req: HttpRequest) => {
  const { username } = req.user!;

  const user = await container
    .get(UserRepository)
    .getOrCreate(username, new User({ id: username }));

  const body: UserResponse = {
    username: user.id,
    mercedesBenzPaired: !!user.mercedesBenz,
  };

  return {
    body,
  };
});
