import { Response } from "express";
import { LeadImportServices } from "../services/leadImport.services";
import { leadImportRequestSchema } from "../schemas/leadImport.schema";
import { AuthenticatedRequest } from "../types/express";
import { AppError } from "../errors/appError";

export class LeadImportControllers {
  async simulateFile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        throw new AppError(400, "Nenhum arquivo foi enviado");
      }

      const userId = res.locals.decode.id;
      const leadImportServices = new LeadImportServices();
      
      // Processar o arquivo e converter para o formato esperado
      const importData = await leadImportServices.processFile(req.file, userId, req.body.fallback);
      
      // Simular a importação com os dados processados
      const result = await leadImportServices.simulate(importData, userId);
      
      return res.json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos para importação",
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        message: error.message || "Erro ao simular importação de leads",
        error: error.message
      });
    }
  }

  async importFile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        throw new AppError(400, "Nenhum arquivo foi enviado");
      }

      const userId = res.locals.decode.id;
      const leadImportServices = new LeadImportServices();
      
      // Processar o arquivo e converter para o formato esperado
      const importData = await leadImportServices.processFile(req.file, userId, req.body.fallback);
      
      // Realizar a importação com os dados processados
      const result = await leadImportServices.import(importData, userId);
      
      return res.json(result);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos para importação",
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        message: error.message || "Erro ao importar leads",
        error: error.message
      });
    }
  }

  async simulate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = res.locals.decode.id;
      
      // Validar dados da requisição
      const validatedData = leadImportRequestSchema.safeParse({
        leads: req.body.leads,
        fallback: req.body.fallback || {}
      });

      if (!validatedData.success) {
        return res.status(400).json({
          message: "Dados inválidos para importação",
          errors: validatedData.error.errors
        });
      }
      
      const leadImportServices = new LeadImportServices();
      const result = await leadImportServices.simulate(validatedData.data, userId);
      
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao simular importação de leads",
        error: error.message
      });
    }
  }

  async import(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = res.locals.decode.id;
      
      // Validar dados da requisição
      const validatedData = leadImportRequestSchema.safeParse({
        leads: req.body.leads,
        fallback: req.body.fallback || {}
      });

      if (!validatedData.success) {
        return res.status(400).json({
          message: "Dados inválidos para importação",
          errors: validatedData.error.errors
        });
      }
      
      const leadImportServices = new LeadImportServices();
      const result = await leadImportServices.import(validatedData.data, userId);
      
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Erro ao importar leads",
        error: error.message
      });
    }
  }
} 