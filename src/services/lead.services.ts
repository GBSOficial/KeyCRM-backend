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

  async findMany(userId: number, userOffices: string, showAllLeads: boolean = false) {
    // Lista de cargos que podem ver todos os leads
    const allowedOffices = ['Diretor'];
    const canSeeAllLeads = allowedOffices.includes(userOffices);

    let where = {};
    
    // Se não for diretor, só pode ver seus próprios leads
    if (!canSeeAllLeads) {
      where = { userId };
    }
    // Se for diretor e showAllLeads for false, mostra apenas seus leads
    else if (!showAllLeads) {
      where = { userId };
    }
    // Se for diretor e showAllLeads for true, não aplica filtro de userId
    
    try {
      const leads = await prisma.lead.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              img: true,
              email: true,
              offices: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return leads;
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      throw error;
    }
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

  async update(id: number, data: any, userId: number, userOffices: string) {
    const allowedOffices = ['Diretor'];
    const canUpdateUserId = allowedOffices.includes(userOffices);

    // Se não for diretor, só pode atualizar seus próprios leads
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        ...(canUpdateUserId ? {} : { userId }),
      },
    });

    if (!lead) {
      throw new AppError(404,"Lead não encontrado");
    }

    // Se não for diretor, remove o userId do objeto data
    let updateData = { ...data };
    if (!canUpdateUserId) {
      const { userId: _, ...rest } = updateData;
      updateData = rest;
    }

    const updatedLead = await prisma.lead.update({
      where: {
        id,
      },
      data: updateData,
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