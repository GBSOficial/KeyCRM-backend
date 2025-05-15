import { Router } from "express";
import { ApiTokenControllers } from "../controllers/apiToken.controllers";
import { ValidateToken } from "../middlewares/validateToken.middlewares";

export const apiTokenRouter = Router();

const apiTokenControllers = new ApiTokenControllers();

apiTokenRouter.post("/", ValidateToken.execute, apiTokenControllers.create);
apiTokenRouter.get("/", ValidateToken.execute, apiTokenControllers.findMany);
apiTokenRouter.get("/:id", ValidateToken.execute, apiTokenControllers.findOne);
apiTokenRouter.patch("/:id", ValidateToken.execute, apiTokenControllers.update);
apiTokenRouter.delete("/:id", ValidateToken.execute, apiTokenControllers.delete);
