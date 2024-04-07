import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaService } from "src/prisma.service";
import { ImageController } from "./image.controller";

@Module({
  controllers: [ProductController, ImageController],
  providers: [ProductService, PrismaService],
  exports: [PrismaService],
})
export class ProductModule {}
