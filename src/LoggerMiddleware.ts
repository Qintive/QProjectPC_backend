import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response } from "express"; // Импортируйте типы из express

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: Function) {
    res.on("finish", () => {
      const { method, originalUrl } = req;
      const statusCode = res.statusCode;
      this.logger.log(`${method} ${originalUrl} ${statusCode}`);
    });
    next();
  }
}
