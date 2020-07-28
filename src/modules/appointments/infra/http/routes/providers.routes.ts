import { Router } from "express";
import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";
import { celebrate, Segments, Joi } from "celebrate";
import ProvidersController from "../controllers/ProvidersController";
import ProvidersDayAvailabilityController from "../controllers/ProvidersDayAvailabilityController";
import ProvidersMonthAvailabilityController from "../controllers/ProvidersMonthAvailabilityController";

const providersRouter = Router();
const providersController = new ProvidersController();
const providersDayAvailabilityController = new ProvidersDayAvailabilityController();
const providersMonthAvailabilityController = new ProvidersMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get("/", providersController.index);

providersRouter.get(
  "/:provider_id/day-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersDayAvailabilityController.index,
);
providersRouter.get(
  "/:provider_id/month-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersMonthAvailabilityController.index,
);

export default providersRouter;
