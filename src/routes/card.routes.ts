import { Router } from "express";
import { CardControllers } from "../controllers/card.controllers";
import { ValidateBody } from "../middlewares/validateBody.middlewares";
import { createCardSchema, updateCardSchema } from "../schemas/card.schema";

export const cardRouter = Router();
const cardControllers = new CardControllers();

cardRouter.post("/", ValidateBody.execute(createCardSchema), cardControllers.create);
cardRouter.get("/list/:listId", cardControllers.findManyByList);
cardRouter.get("/:id", cardControllers.findOne);
cardRouter.patch("/:id", ValidateBody.execute(updateCardSchema), cardControllers.update);
cardRouter.delete("/:id", cardControllers.delete); 