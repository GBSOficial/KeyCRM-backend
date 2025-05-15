import { z } from "zod";

export const userSchema = z.object({
    id: z.number().positive(),
    name: z.string().min(1),
    email: z.string().email('Email inválido').min(1),
    password: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
    offices: z.string(),
    img: z.string().optional()
})

export type TUser = z.infer<typeof userSchema>;

export const userRegisterBodySchema = userSchema.omit({ id: true});

export const userUpdateSchema = userRegisterBodySchema.partial();

export type TUserUpdate = z.infer<typeof userUpdateSchema>;

export type TUserRegisterBody = z.infer<typeof userRegisterBodySchema>;

export const userLoginBodySchema = userRegisterBodySchema.omit({ name: true, offices: true});

export type TUserLoginbody = z.infer<typeof userLoginBodySchema>;

export const userReturnSchema = userSchema.omit({ password: true});

export type TUserReturn = z.infer<typeof userReturnSchema>;


export type TUserLoginReturn = {
    accessToken: string;
    user: TUserReturn;
}



