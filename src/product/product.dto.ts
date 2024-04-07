import { IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

export class ProductDto {
  @IsString()
  name: string;
  image: string;
  description: string;

  @IsNumber()
  price: number;
}

export class PartialProductDto extends PartialType(ProductDto) {}
