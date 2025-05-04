import { Cradle } from "@fastify/awilix";
import { RESOLVER } from "awilix";

export abstract class BaseService {
  static [RESOLVER] = {};
  protected ioc: Cradle;

  constructor(ioc: Cradle) {
    this.ioc = ioc;
  }
}
