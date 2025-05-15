import { Router } from "express";
import { BoardControllers } from "../controllers/board.controllers";
import { ValidateBody } from "../middlewares/validateBody.middlewares";
import { createBoardSchema, updateBoardSchema } from "../schemas/board.schema";
import { ValidateToken } from "../middlewares/validateToken.middlewares";

export const boardRouter = Router();
const boardControllers = new BoardControllers();

boardRouter.post("/", ValidateToken.execute, ValidateBody.execute(createBoardSchema), boardControllers.create);
boardRouter.get("/", boardControllers.findMany);
boardRouter.get("/:id", boardControllers.findOne);
boardRouter.patch("/:id", ValidateToken.execute, ValidateBody.execute(updateBoardSchema), boardControllers.update);
boardRouter.delete("/:id", ValidateToken.execute, boardControllers.delete); 