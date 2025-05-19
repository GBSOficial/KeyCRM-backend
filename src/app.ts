import "express-async-errors";
import express, { json, Request, Response, NextFunction, ErrorRequestHandler }  from "express";
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
import fs from 'fs';
import { AuthenticatedRequest } from "./types/express";

// Definindo o caminho do diretório de uploads
const uploadDir = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'uploads')
  : path.join(__dirname, '../uploads');

// Criando o diretório se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Criando o diretório temporário para uploads
const tempDir = path.join(uploadDir, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const app = express();

app.use(helmet());

// CORS global para API
app.use(cors({
  origin: ['https://painel.poppys.pt', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

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
  const allowedOrigins = ['https://painel.poppys.pt', 'http://localhost:3000', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Atualizando o caminho dos arquivos estáticos
app.use("/uploads", express.static(uploadDir));

// Middleware de tratamento de erros
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  return HandleErrors.execute(err, req as Request, res, next);
};

app.use(errorHandler);


