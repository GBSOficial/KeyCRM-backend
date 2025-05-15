import { Router } from "express";
import { UserControllers } from "../controllers/user.controllers";
import { ValidateBody } from "../middlewares/validateBody.middlewares";
import { userLoginBodySchema, userRegisterBodySchema } from "../schemas/user.schemas";
import { ValidateToken } from "../middlewares/validateToken.middlewares";
import multer from "multer";
import path from "path";
import { Request } from "express";

export const userRouter = Router();

const userControllers = new UserControllers();

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

userRouter.post("/",ValidateBody.execute(userRegisterBodySchema),userControllers.register);
userRouter.post("/login",ValidateBody.execute(userLoginBodySchema),userControllers.login);
userRouter.get("/", userControllers.findMany);
userRouter.get("/:id", ValidateToken.execute ,userControllers.getUser);
userRouter.patch("/:id", ValidateToken.execute ,userControllers.update)
userRouter.patch("/:id/profile-image", upload.single("image"), userControllers.uploadProfileImage)
userRouter.delete("/:id", userControllers.delete)
