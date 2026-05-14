import "reflect-metadata";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

function corsOrigins() {
  const defaults = [
    "https://qinshixian-web-prod.onrender.com",
    "https://qinshixian-admin-web-prod.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001"
  ];
  const configured = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaults, ...configured]));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = corsOrigins();
  app.enableCors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`), false);
    }
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("Qinshixian API")
    .setDescription("秦時線前台、後台與營運管理 API")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));

  await app.listen(Number(process.env.PORT ?? process.env.API_PORT ?? 4000), "0.0.0.0");
}

void bootstrap();
