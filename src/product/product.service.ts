import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductDto } from "./product.dto";
import { PrismaService } from "src/prisma.service";
import path from "path";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: +id,
      },
    });

    if (!product) throw new NotFoundException("Продукт не найден!");

    return product;
  }

  getAll() {
    return this.prisma.product.findMany();
  }

  async create(dto: ProductDto) {
    const { name, description, price, image } = dto;

    const product = await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
      },
    });

    return product;
  }

  async toggleDone(id: string) {
    const product = await this.getById(id);
    return this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        isDone: !product.isDone,
      },
    });
  }
}
