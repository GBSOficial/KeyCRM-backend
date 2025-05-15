import { PrismaClient } from "@prisma/client";
import { AppError } from "../errors/appError";
import { NotificationServices } from "./notification.services";

const prisma = new PrismaClient();

export class LeadServices {
  async create(data: any, userId: number) {
    const lead = await prisma.lead.create({
      data: {
        ...data,
        userId,
      },
    });

    // Disparar notificação ao criar lead
    const notificationServices = new NotificationServices();
    await notificationServices.create({
      title: "Novo Lead cadastrado",
      message: `Lead ${lead.name} foi cadastrado com sucesso!`,
      userId: userId,
    });

    return lead;
  }

  async findMany(userId: number) {
    const leads = await prisma.lead.findMany({
      where: {
        userId,
      },
    });

    return leads;
  }

  async findOne(id: number, userId: number) {
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!lead) {
      throw new AppError(404,"Lead não encontrado");
    }

    return lead;
  }

  async update(id: number, data: any, userId: number) {
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!lead) {
      throw new AppError(404,"Lead não encontrado");
    }

    const updatedLead = await prisma.lead.update({
      where: {
        id,
      },
      data,
    });

    return updatedLead;
  }

  async delete(id: number, userId: number) {
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!lead) {
      throw new AppError(404,"Lead não encontrado");
    }

    await prisma.lead.delete({
      where: {
        id,
      },
    });
  }
} 