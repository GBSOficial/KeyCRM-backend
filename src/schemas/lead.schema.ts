import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  company: z.string().optional(),
  status: z.enum([
    "NOVOS_LEADS",
    "CONTATO_INICIAL",
    "QUALIFICACAO",
    "EM_PROPOSTA",
    "FASE_FINAL",
    "REGISTRO_CONTRATO",
    "MASTER_OFFICE",
    "NEGATIVA",
    "SEM_RETORNO"
  ]),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial(); 