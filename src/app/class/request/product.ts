import { Brand } from "../dto/brand";
import { Category } from "../dto/category";
import { Material } from "../dto/material";
import { Sole } from "../dto/sole";

export class Product {
  id: string = '';
  productName: string = '';
  idBrand: Brand = new Brand();
  idCategory: Category = new Category();
  idSole: Sole = new Sole();
  idMaterial: Material = new Material();
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
