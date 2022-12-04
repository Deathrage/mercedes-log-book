import "reflect-metadata";
import { Container } from "inversify";

const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
});

export default container;
