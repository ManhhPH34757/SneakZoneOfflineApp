export interface FilterProduct {
  productName?: string,
  idBrand?: string,
  idCategory?: string,
  idMaterial?: string,
  idSole?: string,
  min?: number,
  max?: number,
  [key: string]: any;
}
