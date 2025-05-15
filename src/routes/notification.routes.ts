import { Router } from "express";
import { NotificationControllers } from "../controllers/notification.controllers";

const notificationControllers = new NotificationControllers();
const router = Router();

router.post("/", notificationControllers.create);
router.get("/:userId", notificationControllers.findMany);
router.patch("/:userId/:id/read", notificationControllers.markAsRead);
router.delete("/:userId/:id", notificationControllers.delete);

export { router as notificationRouter }; 