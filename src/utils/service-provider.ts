import { FastifyRequest, FastifyInstance } from "fastify";

type ServiceNames = keyof FastifyInstance["diContainer"]["cradle"];

type ServicesMap<T extends ServiceNames[]> = {
  [K in T[number]]: FastifyInstance["diContainer"]["cradle"][K];
};

class ServiceProvider {
  private constructor() {}

  public static getServices<T extends ServiceNames[]>(
    request: FastifyRequest,
    serviceNames: T,
  ): ServicesMap<T> {
    const services = serviceNames.reduce(
      (acc, serviceName) => {
        const service = (request.server as FastifyInstance).diContainer.resolve(
          serviceName,
        );

        if (!service) {
          throw new Error(`Service '${serviceName}' not found in diContainer`);
        }

        acc[serviceName as keyof typeof acc] = service;

        return acc;
      },
      {} as { [K in T[number]]?: any },
    );

    return services as ServicesMap<T>;
  }
}

export { ServiceProvider };
