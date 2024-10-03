export class ProductResponse {
  id: string = '';
  productCode: string = '';
  productName: string = '';
  brandName: string = '';
  categoryName: string = '';
  soleName: string = '';
  materialName: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  quantity: number = 0;
}
