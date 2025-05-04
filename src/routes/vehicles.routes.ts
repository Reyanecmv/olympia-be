import { FastifyPluginAsync } from "fastify";

import { authMiddleware } from "@middlewares/auth.middleware.js";

import { IndexVehiclesRequest } from "@app-types/vehicles/IndexVehiclesRequest.js";
import {
  destroyVehiclesSchema,
  indexVehiclesSchema,
  showVehiclesSchema,
  storeVehiclesSchema,
  updateVehiclesSchema,
} from "@validators/vehicles/index.js";
import { VehiclesController } from "@controllers/vehicles.controller.js";
import {
  DestroyVehiclesRequest,
  ShowVehiclesRequest,
  StoreVehiclesRequest,
  UpdateVehiclesRequest,
} from "@app-types/vehicles/index.js";

const vehicles: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<IndexVehiclesRequest>(
    "/",
    { onRequest: authMiddleware, schema: indexVehiclesSchema.schema },
    VehiclesController.index,
  );
  fastify.get<ShowVehiclesRequest>(
    "/:id",
    { onRequest: authMiddleware, schema: showVehiclesSchema.schema },
    VehiclesController.show,
  );
  fastify.put<UpdateVehiclesRequest>(
    "/:id",
    { onRequest: authMiddleware, schema: updateVehiclesSchema.schema },
    VehiclesController.update,
  );
  fastify.post<StoreVehiclesRequest>(
    "/",
    { onRequest: authMiddleware, schema: storeVehiclesSchema.schema },
    VehiclesController.store,
  );
  fastify.delete<DestroyVehiclesRequest>(
    "/:id",
    { onRequest: authMiddleware, schema: destroyVehiclesSchema.schema },
    VehiclesController.destroy,
  );
};

export default vehicles;

export const autoPrefix = "/vehicles";
