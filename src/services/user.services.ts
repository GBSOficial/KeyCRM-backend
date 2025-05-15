import { number } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../errors/appError";
import {
  TUser,
  TUserLoginReturn,
  TUserLoginbody,
  TUserRegisterBody,
  TUserReturn,
  TUserUpdate,
  userReturnSchema,
} from "../schemas/user.schemas";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserServices {
  async register(body: TUserRegisterBody): Promise<TUserReturn> {
    const hashPassowrd = await bcrypt.hash(body.password, 10);
    const newUser = {
      ...body,
      password: hashPassowrd,
    };

    const user = await prisma.user.create({ data: newUser });

    return userReturnSchema.parse(user);
  }
  async login(body: TUserLoginbody): Promise<TUserLoginReturn> {
    const user = await prisma.user.findFirst({ where: { email: body.email } });

    if (!user) {
      throw new AppError(404, "User not registered");
    }

    const compare = await bcrypt.compare(body.password, user.password);

    if (!compare) {
      throw new AppError(403, "Email and password doesn't match");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);

    return { accessToken: token, user: userReturnSchema.parse(user) };
  }

  async findMany(): Promise<TUser[]> {
    const data = await prisma.user.findMany();
    const dataFixed = data.map(u => ({
      ...u,
      img: u.img ?? undefined
    }));
    return dataFixed;
  }

  async getUser(id: number): Promise<TUserReturn> {
    const user = await prisma.user.findFirst({ where: { id } });
    const userFixed = user ? { ...user, img: user.img ?? undefined } : user;
    return userReturnSchema.parse(userFixed);
  }

  async update(id: number, body: TUserUpdate & { img?: string }){
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new AppError(404, "User not found");
    }

   const updatedUser = await prisma.user.update({
    where: { id },
    data: {
     ...body,
      password: body.password? await bcrypt.hash(body.password, 10) : user.password,
    },
  });

    const updatedUserFixed = { ...updatedUser, img: updatedUser.img ?? undefined };
    return userReturnSchema.parse(updatedUserFixed);
  }
  
  async delete(id: number): Promise<void>{
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new AppError(404, "User not found");
    }
   await prisma.user.delete({ where: { id: id}})

  }
}
