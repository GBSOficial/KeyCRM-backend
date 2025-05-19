import { Router } from "express";
import { LeadControllers } from "../controllers/lead.controllers";
import { LeadImportControllers } from "../controllers/leadImport.controllers";
import { createLeadSchema, updateLeadSchema } from "../schemas/lead.schema";
import { ValidateToken } from "../middlewares/validateToken.middlewares";
import { uploadConfig } from "../middlewares/upload.middlewares";

export const leadRouter = Router();

const leadControllers = new LeadControllers();
const leadImportControllers = new LeadImportControllers();

leadRouter.post("/", ValidateToken.execute, leadControllers.create);

leadRouter.get("/", ValidateToken.execute, leadControllers.findMany);

leadRouter.get("/:id", ValidateToken.execute, leadControllers.findOne);

leadRouter.patch("/:id", ValidateToken.execute, leadControllers.update);

leadRouter.delete("/:id", ValidateToken.execute, leadControllers.delete);

leadRouter.post("/import/simulate", ValidateToken.execute, leadImportControllers.simulate);

leadRouter.post("/import", ValidateToken.execute, leadImportControllers.import);

leadRouter.post(
  "/import/file/simulate",
  ValidateToken.execute,
  uploadConfig.single('file'),
  leadImportControllers.simulateFile
);

leadRouter.post(
  "/import/file",
  ValidateToken.execute,
  uploadConfig.single('file'),
  leadImportControllers.importFile
);
