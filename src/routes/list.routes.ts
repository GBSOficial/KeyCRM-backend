import { Router } from "express";
import { ListControllers } from "../controllers/list.controllers";
import { ValidateBody } from "../middlewares/validateBody.middlewares";
import { createListSchema, updateListSchema } from "../schemas/list.schema";
import { ValidateToken } from "../middlewares/validateToken.middlewares";

export const listRouter = Router();
const listControllers = new ListControllers();

listRouter.post("/", ValidateToken.execute, ValidateBody.execute(createListSchema), listControllers.create);
listRouter.get("/board/:boardId", listControllers.findManyByBoard);
listRouter.get("/:id", listControllers.findOne);
listRouter.patch("/:id", ValidateToken.execute, ValidateBody.execute(updateListSchema), listControllers.update);
listRouter.delete("/:id", ValidateToken.execute, listControllers.delete); 