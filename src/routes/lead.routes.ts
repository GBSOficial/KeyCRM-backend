import { Router } from "express";
import { LeadControllers } from "../controllers/lead.controllers";
import { createLeadSchema, updateLeadSchema } from "../schemas/lead.schema";
import { ValidateToken } from "../middlewares/validateToken.middlewares";

export const leadRouter = Router();

const leadControllers = new LeadControllers();

leadRouter.post("/", ValidateToken.execute, leadControllers.create);

leadRouter.get("/", ValidateToken.execute, leadControllers.findMany);

leadRouter.get("/:id", ValidateToken.execute, leadControllers.findOne);

leadRouter.patch("/:id", ValidateToken.execute, leadControllers.update);

leadRouter.delete("/:id", ValidateToken.execute, leadControllers.delete);
