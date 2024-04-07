import {
  Injectable,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Response } from "express";
import * as fs from "fs";
import { PrismaService } from "src/prisma.service"; // Импортируйте сервис Prisma

@Injectable()
@Controller("uploads")
export class ImageController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads", // Папка для сохранения изображений
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const filename = uuidv4() + ext; // Генерация уникального имени файла
          cb(null, filename);
        },
      }),
    })
  )
  async uploadImage(
    @UploadedFile() file: Multer.File,
    @Body() body: { name: string; price: number; description: string }
  ) {
    const imagePath = `/uploads/${file.filename}`;
    const priceAsString = body.price.toString();

    // Сохранение информации в базе данных
    await this.prisma.product.create({
      data: {
        name: body.name,
        price: +priceAsString,
        description: body.description,
        image: file.filename,
      },
    });

    return { imagePath };
  }

  @Get(":filename")
  async getImage(@Param("filename") filename: string, @Res() res: Response) {
    const imagePath = path.join(process.cwd(), "uploads", filename);

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    } else {
      return res.status(404).send("Изображение не найдено");
    }
  }

  @Get()
  async getAllImages(@Res() res: Response) {
    // Получите изображения из базы данных и отсортируйте их по id в порядке убывания
    const images = await this.prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const imagePaths = images.map((image) => `/uploads/${image.image}`);

    return res.json({ imagePaths });
  }
}
