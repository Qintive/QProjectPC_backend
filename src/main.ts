import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import * as multer from "multer";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Создайте экземпляр Express приложения
  const expressApp = express();

  // Настройте Multer
  const upload = multer({ dest: "uploads/" }); // Укажите папку для сохранения загруженных файлов

  // Включите обработку запросов Express в приложении NestJS
  app.use(expressApp);

  app.enableCors({
    origin: "http://localhost:3000",
  });

  await app.listen(3001);
}
bootstrap();