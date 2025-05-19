import { Response } from "express";
import { ApiTokenServices } from "../services/apiToken.services";
import { AuthenticatedRequest } from "../types/express";

export class ApiTokenControllers {
  async create(req: AuthenticatedRequest, res: Response) {
    const { userId, name, expiresIn } = req.body;
    const service = new ApiTokenServices();
    try {
      const apiToken = await service.create({ userId, name, expiresIn });
      return res.status(201).json({
        id: apiToken.id,
        user: {
          id: apiToken.user.id,
          name: apiToken.user.name,
          email: apiToken.user.email
        },
        name: apiToken.name,
        token: apiToken.token,
        createdAt: apiToken.createdAt,
        expiresAt: apiToken.expiresAt
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  async findMany(req: AuthenticatedRequest, res: Response) {
    const service = new ApiTokenServices();
    const tokens = await service.findMany();
    return res.status(200).json(tokens.map(token => ({
      id: token.id,
      user: token.user,
      name: token.name,
      token: token.token,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt
    })));
  }

  async findOne(req: AuthenticatedRequest, res: Response) {
    const service = new ApiTokenServices();
    try {
      const token = await service.findOne(Number(req.params.id));
      return res.status(200).json({
        id: token.id,
        user: token.user,
        name: token.name,
        token: token.token,
        createdAt: token.createdAt,
        expiresAt: token.expiresAt
      });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const service = new ApiTokenServices();
    try {
      const token = await service.update(Number(req.params.id), req.body);
      return res.status(200).json(token);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const service = new ApiTokenServices();
    try {
      const result = await service.delete(Number(req.params.id));
      return res.status(204).json(result);
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
}
