import { Request, Response } from "express";
import { LeadServices } from "../services/lead.services";

export class LeadControllers {
  async create(req: Request, res: Response): Promise<Response> {
    const leadServices = new LeadServices();
    const userId = req.body.userId || res.locals.decode.id;

    const data = await leadServices.create(req.body, userId);

    return res.status(201).json(data);
  }

  async findMany(req: Request, res: Response): Promise<Response> {
    const leadServices = new LeadServices();
    const userId = res.locals.decode.id;
    const userOffices = res.locals.decode.offices;
    const showAllLeads = req.query.showAll === 'true';

    const data = await leadServices.findMany(userId, userOffices, showAllLeads);

    return res.status(200).json(data);
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const leadServices = new LeadServices();
    const userId = res.locals.decode.id;

    const data = await leadServices.findOne(Number(req.params.id), userId);

    return res.status(200).json(data);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const leadServices = new LeadServices();
    const userId = res.locals.decode.id;
    const userOffices = res.locals.decode.offices;

    const data = await leadServices.update(
      Number(req.params.id),
      req.body,
      userId,
      userOffices
    );

    return res.status(200).json(data);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const leadServices = new LeadServices();
    const userId = res.locals.decode.id;

    await leadServices.delete(Number(req.params.id), userId);

    return res.status(204).json();
  }
} 