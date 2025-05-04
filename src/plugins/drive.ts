import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { asValue } from "awilix";
import { Services } from "@app-types/drive.js";
import driveConfig from "@config/drive.js";
import { DriveManager } from "flydrive";
import { FSDriver } from "flydrive/drivers/fs";
import { S3Driver } from "flydrive/drivers/s3";

export const drive = new DriveManager<Services>({
  /**
   * Name of the default service. It must be defined inside
   * the service object
   */
  default: driveConfig.defaultDisk,

  /**
   * A collection of services you plan to use in your application
   */
  services: {
    local: () => new FSDriver(driveConfig.disks.local),
    s3: () => new S3Driver(driveConfig.disks.s3),
  },
});

const fastifyFlydriveInit = async (fastify: FastifyInstance) => {
  fastify.diContainer.register("drive", asValue(drive));
  fastify.diContainer.register("disk", asValue(drive.use()));
};

export default fp(async (fastify) => {
  fastifyFlydriveInit(fastify);
});
