import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../class/dto/brand';
import { ProductRequest } from '../../class/request/product-request';
import { Category } from '../../class/dto/category';
import { Material } from '../../class/dto/material';
import { Sole } from '../../class/dto/sole';
import { CategoryService } from '../../services/category.service';
import { MaterialService } from '../../services/material.service';
import { SoleService } from '../../services/sole.service';
import { ProductResponse } from '../../class/response/product-response';
import { ProductService } from '../../services/product.service';
import { ProductImageService } from '../../services/product-image.service';
import { ProductImage } from '../../class/dto/product-image';
import { v4 as uuidv4 } from 'uuid';
import { forkJoin, Observable } from 'rxjs';
import { FilterProduct } from '../../class/request/filter-product';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

declare const bootstrap: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  size: number = 5;
  totalPages: number = 0;
  currentPage: number = 0;
  displayedPages: number[] = [];

  constructor(
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly materialService: MaterialService,
    private readonly soleService: SoleService,
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService
  ) {}

  product: ProductRequest = new ProductRequest();
  products: ProductResponse[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  materials: Material[] = [];
  soles: Sole[] = [];
  selectedFiles: File[] = [];
  originalFiles: File[] = [];

  editing: boolean = false;
  showAlertErrorImages: boolean = false;
  showAlertSuccess: boolean = false;

  checkProductCode: boolean = true;
  checkProductName: boolean = true;
  checkBrand: boolean = true;
  checkCategory: boolean = true;
  checkMaterial: boolean = true;
  checkSole: boolean = true;
  checkImages: boolean = true;
  checkFileName: boolean =  true;

  filter: FilterProduct = {};
  fileName: string = '';

  data: any[] = [];
  headers: string[] = [];

  ngOnInit(): void {
    this.productService.getAllProducts(0, this.size).subscribe((data) => {
      this.loadProducts(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.loadBrands();
      this.loadCategories();
      this.loadMaterials();
      this.loadSoles();
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe((data) => {
      this.brands = data.result;
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data.result;
    });
  }

  loadMaterials(): void {
    this.materialService.getAllMaterials().subscribe((data) => {
      this.materials = data.result;
    });
  }

  loadSoles(): void {
    this.soleService.getAllSoles().subscribe((data) => {
      this.soles = data.result;
    });
  }

  loadProducts(data: any): void {
    this.products = data.result.content;
  }

  onSubmit(): void {
    if (this.validation()) {
      this.prepareProduct();

      this.productService.createProduct(this.product).subscribe({
        next: () => {
          this.handleImageUpload(this.product.id, this.selectedFiles, () => {
            this.refreshProductList('success');
          });
        },
        error: (error) => {
          console.error('Error occurred while creating product:', error);
        },
      });
    }
  }

  onUpdate(): void {
    if (this.validation()) {
      this.product.updatedAt = this.getDate();
      console.log(this.product);
      this.productService.updateProduct(this.product).subscribe({
        next: () => {
          if (!this.selectedFiles || this.selectedFiles.length === 0) {
            console.error('No files selected!');
            return;
          }

          if (this.originalFiles !== this.selectedFiles) {
            this.productImageService.deleteProductImageByIdProduct(
              this.product.id
            ).subscribe(() => {
              this.handleImageUpload(this.product.id, this.selectedFiles, () => {
                this.refreshProductList('success');
              });
            });
          } else {
            this.refreshProductList('success');
          }
        },
        error: (error) => {
          console.error('Error occurred while updating product:', error);
        },
      });
    }
  }

  private prepareProduct(): void {
    const idProduct = uuidv4();
    this.product.id = idProduct;
    this.product.createdAt = this.getDate();
    this.product.updatedAt = this.getDate();
  }

  private handleImageUpload(
    idProduct: string,
    files: File[],
    callback: () => void
  ): void {
    if (!files || files.length === 0) {
      console.error('No files selected!');
      return;
    }

    const imageRequests = files.map((file) =>
      this.createProductImage(idProduct, file)
    );

    forkJoin(imageRequests).subscribe({
      next: callback,
      error: (error) => {
        console.error('Error occurred while creating product images:', error);
      },
    });
  }

  private createProductImage(idProduct: string, file: File): Observable<any> {
    const productImage: ProductImage = {
      id: uuidv4(),
      idProduct: idProduct,
      images: file.name,
    };

    return this.productImageService.createProductImages(productImage);
  }

  private refreshProductList(alertMessage: string): void {
    this.productService.getAllProducts(0, this.size).subscribe((data) => {
      this.loadProducts(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.clear();
      this.displayAlert(alertMessage);
    });
  }

  validation(): boolean {
    let productCode = (
      document.getElementById('productCode') as HTMLInputElement
    ).value.trim();
    let productName = (
      document.getElementById('productName') as HTMLInputElement
    ).value.trim();
    let brand = (document.getElementById('brand') as HTMLSelectElement).value;
    let category = (document.getElementById('category') as HTMLSelectElement)
      .value;
    let material = (document.getElementById('material') as HTMLSelectElement)
      .value;
    let sole = (document.getElementById('sole') as HTMLSelectElement).value;

    const checkEmpty = (value: string): boolean => value.length > 0;

    this.checkProductCode = checkEmpty(productCode);
    this.checkProductName = checkEmpty(productName);
    this.checkBrand = checkEmpty(brand);
    this.checkCategory = checkEmpty(category);
    this.checkMaterial = checkEmpty(material);
    this.checkSole = checkEmpty(sole);
    this.checkImages = this.selectedFiles.length > 0;

    return (
      this.checkProductCode &&
      this.checkProductName &&
      this.checkBrand &&
      this.checkCategory &&
      this.checkMaterial &&
      this.checkSole &&
      this.checkImages
    );
  }

  openFilePicker(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  openFileImport(): void {
    const fileInput = document.getElementById('file-import') as HTMLInputElement;
    fileInput.click();
  }

  onSelectImages(event: any): void {
    const files: File[] = Array.from(event.target.files);

    if (files.length > 5) {
      this.displayAlert('error');
      this.selectedFiles = [];
    } else {
      this.selectedFiles = files;
    }
  }
  
  edit(productEdit: ProductResponse) {
    this.productService.getProductById(productEdit.id).subscribe((data) => {
      this.product = data.result;

      this.productImageService
        .getProductImagesById(productEdit.id)
        .subscribe((data) => {
          let images: any = data.result;

          let imageUrls: File[] = [];

          for (const element of images) {
            const dummyFile = new File([new Blob()], element.images, {
              type: 'image/jpeg',
            });

            imageUrls.push(dummyFile);
          }

          this.selectedFiles = imageUrls;
          this.originalFiles = this.selectedFiles;
        });

      this.editing = true;
    });
  }

  getAll(): void {
    this.productService.getAllProducts(0, this.size).subscribe((data) => {
      this.loadProducts(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.filter = {};
    });
  }

  filters(): void {
    this.productService.getAllProducts(0, this.size, this.filter).subscribe((data) => {
      this.loadProducts(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
    });
  }

  clear(): void {
    this.product = new ProductRequest();
    this.selectedFiles = [];
    this.editing = false;
    this.checkProductCode = true;
    this.checkProductName = true;
    this.checkBrand = true;
    this.checkCategory = true;
    this.checkMaterial = true;
    this.checkSole = true;
    this.checkImages = true;
  }

  updateDisplayedPages(): void {
    if (this.totalPages <= 5) {
      this.displayedPages = Array.from(
        { length: this.totalPages },
        (_, index) => index + 1
      );
      return;
    }

    if (this.currentPage < 3) {
      this.displayedPages = [1, 2, 3, 4, 5];
    } else if (this.currentPage >= this.totalPages - 3) {
      this.displayedPages = [
        this.totalPages - 4,
        this.totalPages - 3,
        this.totalPages - 2,
        this.totalPages - 1,
        this.totalPages,
      ];
    } else {
      this.displayedPages = [
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
        this.currentPage + 2,
        this.currentPage + 3,
      ];
    }
  }

  goToPage(page: number): void {
    if (page < 0 || page > this.totalPages) {
      return;
    }
    this.currentPage = page - 1;
    this.updateDisplayedPages();
    if (this.checkFilter(this.filter)) {
      this.productService.getAllProducts(this.currentPage, this.size, this.filter).subscribe((data) => {
        this.loadProducts(data);
      });
    } else {
      this.productService.getAllProducts(this.currentPage, this.size).subscribe((data) => {
        this.loadProducts(data);
      });
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPrevPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 2);
    }
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  displayAlert(alertType: string): void {
    if (alertType === 'error') {
      this.showAlertErrorImages = true;
      setTimeout(() => {
        this.showAlertErrorImages = false;
      }, 3000);
    } else if (alertType === 'success') {
      this.showAlertSuccess = true;
      setTimeout(() => {
        this.showAlertSuccess = false;
      }, 3000);
    }
  }

  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }

  changeSize() {
    if (this.checkFilter(this.filter)) {
      this.productService.getAllProducts(0, this.size, this.filter).subscribe((data) => {
        this.loadProducts(data);
        this.totalPages = data.result.totalPages;
        this.currentPage = 0;
        this.updateDisplayedPages();
      });
    } else {
      this.productService.getAllProducts(0, this.size).subscribe((data) => {
        this.loadProducts(data);
        this.totalPages = data.result.totalPages;
        this.currentPage = 0;
        this.updateDisplayedPages();
      });
    }
  }

  exportToExcel(): void {
    // Chuyển mảng dữ liệu thành WorkSheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);

    // Tạo một Workbook
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    // Xuất file Excel (buffer)
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Lưu file với thư viện file-saver
    this.saveAsExcelFile(excelBuffer, this.fileName);
  }

  // Hàm lưu file Excel
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }

  saveChanges() {
    if (this.fileName.trim() === '') {
      this.checkFileName = false;
      return;
    }

    this.checkFileName = true;
    this.exportToExcel();
    this.close();
    this.displayAlert('success');
    const modalElement = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  checkFilter(filter: FilterProduct): boolean {
    for (const key in filter) {
      if (filter.hasOwnProperty(key) && filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
        return true;
      }
    }
    return false;
  }

  close(): void {
    this.fileName = '';
  }

  onSelectFileImport(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const data = new Uint8Array(arrayBuffer);
        const binaryString = this.ab2str(data);

        const workbook = XLSX.read(binaryString, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        this.data = jsonData.slice(1);
        this.headers = jsonData[0] as string[];
        this.data.forEach(element => {
          
        });

      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  }

  private ab2str(buf: Uint8Array): string {
    return String.fromCharCode(...buf);
  }

}
