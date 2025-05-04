import { Prisma } from "@prisma/client";
import { RESOLVER } from "awilix";
import { BaseService } from "@services/base.service.js";

export class UserService extends BaseService {
  static [RESOLVER] = {};

  public async fetchUser(email: string) {
    return await this.ioc.prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }

  public async createUser(userData: Prisma.UserCreateInput) {
    await this.ioc.prismaClient.user.create({
      data: {
        ...userData,
      },
    });
  }
}
