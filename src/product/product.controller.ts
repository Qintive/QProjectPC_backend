import {
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDto, PartialProductDto } from "./product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Multer } from "multer"; // Импортируйте Multer отсюда

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("image")) // 'image' должно соответствовать имени поля в вашем DTO
  async create(
    @UploadedFile() image: Multer.File, // Здесь используем Express.Multer.File
    @Body() dto: PartialProductDto
  ) {
    dto.image = image; // Прикрепите загруженное изображение к DTO
    return this.productService.create(dto as ProductDto);
  }

  @Patch(":id")
  async toggleDone(@Param("id") id: string) {
    return this.productService.toggleDone(id);
  }
}

