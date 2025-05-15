import "express-async-errors";
import express, { json }  from "express";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";
import { userRouter } from "./routes/user.routes";
import { HandleErrors } from "./middlewares/handleErrors.middlewares";
import swaggerDocs from "./swagger.json"
import { leadRouter } from "./routes/lead.routes";
import { apiTokenRouter } from "./routes/apiToken.routes";
import { boardRouter } from "./routes/board.routes";
import { listRouter } from "./routes/list.routes";
import { cardRouter } from "./routes/card.routes";
import { notificationRouter } from "./routes/notification.routes";
import path from "path";

export const app = express();

app.use(helmet());

// CORS global para API
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/v1/user", userRouter);
app.use("/v1/lead", leadRouter);
app.use("/v1/apitoken", apiTokenRouter);
app.use("/v1/board", boardRouter);
app.use("/v1/list", listRouter);
app.use("/v1/card", cardRouter);
app.use("/v1/notification", notificationRouter);

// CORS para arquivos estáticos
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(HandleErrors.execute);


