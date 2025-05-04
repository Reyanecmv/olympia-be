import { AutoloadPluginOptions } from "@fastify/autoload";
import type { UserService } from "@services/user.service.js";
import type { ReservationService } from "@services/reservation.service.js";
import { FastifyServerOptions } from "fastify";
import { Client } from "soap";
import type { PrismaClient } from "@prisma/client";
import type { Disk, DriveManager } from "flydrive";
import { Services } from "./drive.js";
import { VehicleService } from "@services/vehicle.service.js";
import type { ReservationPaymentsService } from "@services/reservation-payments.service.js";
import { AxiosPluginInstance } from "src/plugins/axios.js";

export interface Action<TParams = unknown, TResult = unknown> {
  execute(params?: TParams): Promise<TResult> | TResult;
}

export const globalActionTypes: Record<string, new (...args: any[]) => Action> =
  {};

export interface ActionTypes {}

export type ActionParams<T extends keyof ActionTypes> =
  ActionTypes[T] extends Action<infer P, any> ? P : never;

export type ActionResult<T extends keyof ActionTypes> =
  ActionTypes[T] extends Action<any, infer R> ? R : never;

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

declare module "fastify" {
  interface FastifyInstance {
    actions?: Map<string, Action>;
    executeAction<T extends keyof ActionTypes>(
      actionName: T,
      params?: ActionParams<T>,
    ): Promise<ActionResult<T>>;
  }
  interface FastifyRequest {
    userId?: string;
  }
}

declare module "@fastify/awilix" {
  interface Cradle {
    services: {};
    userService: UserService;
    reservationService: ReservationService;
    reservationPaymentsService: ReservationPaymentsService;
    vehicleService: VehicleService;
    prismaClient: PrismaClient;
    soapClient: Client;
    drive: DriveManager<Services>;
    disk: Disk;
    actions: Map<string, Action>;
    axios: AxiosPluginInstance;
  }
  interface RequestCradle {}
}
