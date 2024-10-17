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
import { catchError, firstValueFrom, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterProduct } from '../../class/request/filter-product';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';
import { ImageService } from '../../services/image.service';
import { ColorService } from '../../services/color.service';
import { SizeService } from '../../services/size.service';
import { ProductDetailsService } from '../../services/product-details.service';

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
    private readonly productImageService: ProductImageService,
    private readonly imageService: ImageService,
    private readonly colorService: ColorService,
    private readonly sizeService: SizeService,
    private readonly productDetailsService: ProductDetailsService
  ) { }

  product: ProductRequest = new ProductRequest();
  products: ProductResponse[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  materials: Material[] = [];
  soles: Sole[] = [];
  selectedFiles: any[] = [];
  originalFiles: any[] = [];

  editing: boolean = false;
  showAlertSuccess: boolean = false;
  showAlertError: boolean = false;
  alertMessage: string = '';

  checkProductCode: boolean = true;
  checkProductName: boolean = true;
  checkBrand: boolean = true;
  checkCategory: boolean = true;
  checkMaterial: boolean = true;
  checkSole: boolean = true;
  checkImages: boolean = true;
  checkFileName: boolean = true;
  checkExistsProductCode: boolean = true;
  checkExistsProductName: boolean = true;
  role: boolean = false;

  filter: FilterProduct = {};
  fileName: string = '';

  data: any[] = [];
  data2: any[] = [];
  data3: any[] = [];

  images: any[] = [];
  allImages: any[] = [];
  searchText: string = '';

  ngOnInit(): void {
    const token: any = localStorage.getItem('access_token');
    const decoded: any = jwtDecode(token);
    if (decoded.scope == 'ADMIN') {
      this.role = true;
    }
    this.productService.getAllProducts(0, this.size).subscribe((data) => {
      this.loadProducts(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.loadBrands();
      this.loadCategories();
      this.loadMaterials();
      this.loadSoles();
      this.imageService.getImageList().subscribe((images: any) => {
        this.allImages = images.result.map((image: any) => ({
          ...image,
          isSelected: false,
        }));
        this.images = [...this.allImages];
      });
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
    this.validation().then((isValid) => {
      if (isValid) {
        this.prepareProduct();

        this.productService.createProduct(this.product).subscribe({
          next: () => {
            this.handleImageUpload(this.product.id, this.selectedFiles, () => {
              this.refreshProductList(
                'success',
                'Create product successfully!'
              );
            });
          },
          error: (error) => {
            console.error('Error occurred while creating product:', error);
          },
        });
      }
    });
  }

  onUpdate(): void {
    this.validation().then((isValid) => {
      if (isValid) {
        this.product.updatedAt = this.getDate();
        this.productService.updateProduct(this.product).subscribe({
          next: () => {
            if (!this.selectedFiles || this.selectedFiles.length === 0) {
              console.error('No files selected!');
              return;
            }

            if (this.originalFiles !== this.selectedFiles) {
              this.deleteAndUploadImages();
            } else {
              this.refreshProductList(
                'success',
                'Update product successfully!'
              );
            }
          },
          error: (error) => {
            console.error('Error occurred while updating product:', error);
          },
        });
      }
    });
  }

  deleteAndUploadImages() {
    this.productImageService
      .deleteProductImageByIdProduct(this.product.id)
      .subscribe(() => {
        this.handleImageUpload(
          this.product.id,
          this.selectedFiles,
          () => {
            this.refreshProductList(
              'success',
              'Update product successfully!'
            );
          }
        );
      });
  }

  private prepareProduct(): void {
    const idProduct = uuidv4();
    this.product.id = idProduct;
    this.product.createdAt = this.getDate();
    this.product.updatedAt = this.getDate();
    this.product.productCode = this.product.productCode.trim();
    this.product.productName = this.product.productName.trim();
  }

  private handleImageUpload(
    idProduct: string,
    files: any,
    callback: () => void
  ): void {
    if (!files || files.length === 0) {
      console.error('No files selected!');
      return;
    }

    const imageRequests = files.map((file: any) =>
      this.createProductImage(idProduct, file)
    );

    forkJoin(imageRequests).subscribe({
      next: callback,
      error: (error) => {
        console.error('Error occurred while creating product images:', error);
      },
    });
  }

  private createProductImage(idProduct: string, file: any): Observable<any> {
    const productImage: ProductImage = {
      id: uuidv4(),
      idProduct: idProduct,
      images: file.secure_url,
    };

    return this.productImageService.createProductImages(productImage);
  }

  private refreshProductList(alertMessage: string, message: string): void {
    this.productService.getAllProducts(0, this.size).subscribe((data) => {
      this.loadProducts(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.clear();
      this.displayAlert(alertMessage, message);
    });
  }

  validation(): Promise<boolean> {
    const productCode = (
      document.getElementById('productCode') as HTMLInputElement
    ).value.trim();
    const productName = (
      document.getElementById('productName') as HTMLInputElement
    ).value.trim();
    const brand = (document.getElementById('brand') as HTMLSelectElement).value;
    const category = (document.getElementById('category') as HTMLSelectElement)
      .value;
    const material = (document.getElementById('material') as HTMLSelectElement)
      .value;
    const sole = (document.getElementById('sole') as HTMLSelectElement).value;

    const checkEmpty = (value: string): boolean => value.length > 0;
    this.checkProductCode = checkEmpty(productCode);
    this.checkProductName = checkEmpty(productName);
    this.checkBrand = checkEmpty(brand);
    this.checkCategory = checkEmpty(category);
    this.checkMaterial = checkEmpty(material);
    this.checkSole = checkEmpty(sole);
    this.checkImages = this.selectedFiles.length > 0;

    if (
      !this.checkProductCode ||
      !this.checkProductName ||
      !this.checkBrand ||
      !this.checkCategory ||
      !this.checkMaterial ||
      !this.checkSole ||
      !this.checkImages
    ) {
      this.checkExistsProductCode = true;
      this.checkExistsProductName = true;
      return Promise.resolve(false);
    }

    const checks: Observable<{ result: boolean }>[] = [];

    if (
      !this.editing ||
      (this.editing && productCode !== this.product.productCode)
    ) {
      checks.push(
        this.productService
          .checkExistsProductCode(productCode)
          .pipe(catchError(() => of({ result: false })))
      );
    } else {
      this.checkExistsProductCode = true;
    }

    if (
      !this.editing ||
      (this.editing && productName !== this.product.productName)
    ) {
      checks.push(
        this.productService
          .checkExistsProductName(productName)
          .pipe(catchError(() => of({ result: false })))
      );
    } else {
      this.checkExistsProductName = true;
    }

    return new Promise((resolve) => {
      if (checks.length === 0) {
        const validationResult =
          this.checkProductCode &&
          this.checkProductName &&
          this.checkBrand &&
          this.checkCategory &&
          this.checkMaterial &&
          this.checkSole &&
          this.checkImages &&
          this.checkExistsProductCode &&
          this.checkExistsProductName;
        resolve(validationResult);
      } else {
        forkJoin(checks).subscribe((results) => {
          if (
            !this.editing ||
            (this.editing && productCode !== this.product.productCode)
          ) {
            this.checkExistsProductCode = !results[0].result;
          }

          if (
            !this.editing ||
            (this.editing && productName !== this.product.productName)
          ) {
            const index = checks.length === 2 ? 1 : 0;
            this.checkExistsProductName = !results[index].result;
          }

          const validationResult =
            this.checkProductCode &&
            this.checkProductName &&
            this.checkBrand &&
            this.checkCategory &&
            this.checkMaterial &&
            this.checkSole &&
            this.checkImages &&
            this.checkExistsProductCode &&
            this.checkExistsProductName;

          resolve(validationResult);
        });
      }
    });
  }

  openFilePicker(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  openFileImport(): void {
    const fileInput = document.getElementById(
      'file-import'
    ) as HTMLInputElement;
    fileInput.click();
  }

  onSelectImages(event: any): void {
    const files: File[] = Array.from(event.target.files);

    this.imageService.uploadImages(files).subscribe({
      next: () => {
        this.imageService.getImageList().subscribe({
          next: (response: any) => {
            const images = response.result;

            if (Array.isArray(images)) {
              this.allImages = images.map((image: any) => ({
                ...image,
                isSelected: false,
              }));
              this.images = [...this.allImages];
              this.displayAlert('success', 'Upload images successfully');
            } else {
              console.error('Expected an array of images but got:', images);
            }
          },
          error: (err) => {
            console.error('Error fetching images:', err);
            this.displayAlert('error', 'Failed to load image list');
          },
        });
      },
      error: (err) => {
        console.error('Error uploading images:', err);
        this.displayAlert('error', 'Upload image failed');
      },
    });
  }

  edit(productEdit: ProductResponse) {
    this.productService.getProductEditById(productEdit.id).subscribe((data) => {
      this.product = data.result;
      this.productImageService
        .getProductImagesById(productEdit.id)
        .subscribe((data) => {
          let images: any = data.result;

          let imageUrls: any[] = [];

          for (const element of images) {
            const dummyFile = {
              secure_url: element.images,
            };
            imageUrls.push(dummyFile);
          }

          this.selectedFiles = imageUrls;
          this.originalFiles = this.selectedFiles;
        });

      this.editing = true;
    });
  }

  delete(product: ProductResponse) {
    this.productDetailsService.checkExistsByIdProduct(product.id).subscribe((data) => {
      if (!data.result) {
        let check = confirm('Are you sure you want to delete this product?');
        if (check) {
          this.productService.deleteProduct(product.id).subscribe(() => {
            this.productService.getAllProducts(0, this.size).subscribe((data) => {
              this.loadProducts(data);
              this.totalPages = data.result.totalPages;
              this.currentPage = 0;
              this.updateDisplayedPages();
              this.loadBrands();
              this.loadCategories();
              this.loadMaterials();
              this.loadSoles();
              this.clear();
            });
          });
        }
      } else {
        this.displayAlert('error', 'Product already exists in product details');
      }
    })
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
    this.productService
      .getAllProducts(0, this.size, this.filter)
      .subscribe((data) => {
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
    this.checkExistsProductCode = true;
    this.checkExistsProductName = true;
    this.imageService.getImageList().subscribe((images: any) => {
      this.allImages = images.result.map((image: any) => ({
        ...image,
        isSelected: false,
      }));
      this.images = [...this.allImages];
    });
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
      this.productService
        .getAllProducts(this.currentPage, this.size, this.filter)
        .subscribe((data) => {
          this.loadProducts(data);
        });
    } else {
      this.productService
        .getAllProducts(this.currentPage, this.size)
        .subscribe((data) => {
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

  displayAlert(alertType: string, message: string): void {
    if (alertType === 'error') {
      this.showAlertError = true;
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = '';
        this.showAlertError = false;
      }, 3000);
    } else if (alertType === 'success') {
      this.showAlertSuccess = true;
      this.alertMessage = message;
      setTimeout(() => {
        this.showAlertSuccess = false;
        this.alertMessage = '';
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
      this.productService
        .getAllProducts(0, this.size, this.filter)
        .subscribe((data) => {
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
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, this.fileName);
  }

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
    this.displayAlert('success', 'Exported successfully');

    const modalElement = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  checkFilter(filter: FilterProduct): boolean {
    for (const key in filter) {
      if (
        filter.hasOwnProperty(key) &&
        filter[key] !== undefined &&
        filter[key] !== null &&
        filter[key] !== ''
      ) {
        return true;
      }
    }
    return false;
  }

  toggleCheckbox(index: number): void {
    this.images[index].isSelected = !this.images[index].isSelected;
  }

  getSelectedImages(): any[] {
    this.selectedFiles = this.images.filter((image) => image.isSelected);
    return this.selectedFiles;
  }

  filterImages() {
    const searchLower = this.searchText.toLowerCase();
    this.images = this.allImages.filter((image) =>
      image.display_name.toLowerCase().includes(searchLower)
    );
  }

  close(): void {
    this.fileName = '';
  }

  saveImages(): void {
    this.searchText = '';
    const modalElement = document.getElementById('exampleModal1');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    this.getSelectedImages();
  }

  onKeyPress(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter') {
      this.toggleCheckbox(index);
    }
  }

  onSelectFileImport(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e: any) => {
        try {
          const arrayBuffer = e.target.result;
          const data = new Uint8Array(arrayBuffer);
          const binaryString = this.ab2str(data);
          const workbook = XLSX.read(binaryString, { type: 'binary' });

          const worksheet1 = workbook.Sheets[workbook.SheetNames[0]];
          const worksheet2 = workbook.Sheets[workbook.SheetNames[1]];
          const worksheet3 = workbook.Sheets[workbook.SheetNames[2]];

          const jsonData1 = XLSX.utils.sheet_to_json(worksheet1, { header: 1 });
          const jsonData2 = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });
          const jsonData3 = XLSX.utils.sheet_to_json(worksheet3, { header: 1 });

          this.data = jsonData1.slice(1).filter((row: any) => row.some((cell: any) => cell !== null && cell !== ''));
          this.data2 = jsonData2.slice(1).filter((row: any) => row.some((cell: any) => cell !== null && cell !== ''));
          this.data3 = jsonData3.slice(1).filter((row: any) => row.some((cell: any) => cell !== null && cell !== ''));

          await Promise.all(this.data.map((element) => this.handleProduct(element)));
          await this.handleProductImages();
          await this.handleProductDetails();

          this.refreshProductList(
            'success',
            'Import product successfully!'
          );
        } catch (error) {
          console.error('Error processing file:', error);
          this.displayAlert('error', 'Import product fails!');
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    }
  }

  private ab2str(buf: Uint8Array): string {
    return String.fromCharCode(...buf);
  }

  async validProduct(product: ProductRequest): Promise<boolean> {
    if (!product.idBrand || !product.idCategory || !product.idMaterial || !product.idSole) {
      return false;
    }

    try {
      const [codeExists, nameExists] = await firstValueFrom(
        forkJoin([
          this.productService.checkExistsProductCode(product.productCode).pipe(map((data) => data.result)),
          this.productService.checkExistsProductName(product.productName).pipe(map((data) => data.result)),
        ])
      );
      return !(codeExists || nameExists);
    } catch (error) {
      console.error('Error checking product code or name:', error);
      return false;
    }
  }

  async handleProduct(element: any) {
    const product = new ProductRequest();
    product.id = uuidv4();
    product.productCode = element[0];
    product.productName = element[1];

    try {
      const [brand, category, material, sole] = await firstValueFrom(
        forkJoin([
          this.brandService.getBrandByName(element[2]).pipe(map((data) => data.result?.id || '')),
          this.categoryService.getCategoryByName(element[3]).pipe(map((data) => data.result?.id || '')),
          this.materialService.getMaterialByName(element[4]).pipe(map((data) => data.result?.id || '')),
          this.soleService.getSoleByName(element[5]).pipe(map((data) => data.result?.id || '')),
        ])
      );

      product.idBrand = brand;
      product.idCategory = category;
      product.idMaterial = material;
      product.idSole = sole;

      product.createdAt = this.getDate();
      product.updatedAt = this.getDate();

      if (await this.validProduct(product)) {
        this.productService.createProduct(product).subscribe();
      }
    } catch (error) {
      console.error('Error handling product:', error);
    }
  }

  async handleProductImages() {
    const imagePromises = this.data2.map(async (imageElement) => {
      try {
        const productExists = await firstValueFrom(
          this.productService.getByProductCode(imageElement[0]).pipe(map((data) => data.result))
        );
        if (productExists) {
          this.productImageService.createProductImages({
            id: uuidv4(),
            idProduct: productExists.id,
            images: imageElement[1],
          }).subscribe();
        }
      } catch (error) {
        console.error('Error handling product images:', error);
      }
    });

    await Promise.all(imagePromises);
  }

  async handleProductDetails() {
    const detailPromises = this.data3.map(async (detailElement) => {
      try {
        const productExists = await firstValueFrom(
          this.productService.getByProductCode(detailElement[0]).pipe(map((data) => data.result))
        );

        if (productExists) {
          const [colorId, sizeId] = await firstValueFrom(
            forkJoin([
              this.colorService.getColorByName(detailElement[1]).pipe(map((data) => data.result?.id || null)),
              this.sizeService.getSizeByName(detailElement[2]).pipe(map((data) => data.result?.id || null)),
            ])
          );

          if (colorId && sizeId) {
            const detailExists = await firstValueFrom(
              this.productDetailsService.checkExists(productExists.id, colorId, sizeId).pipe(map((data) => data.result))
            );

            if (!detailExists && detailElement[3] !== null && detailElement[4] !== null && detailElement[5] !== null) {
              this.productDetailsService.createProductDetails({
                id: uuidv4(),
                idProduct: productExists.id,
                idColor: colorId,
                idSize: sizeId,
                weight: detailElement[3],
                price: detailElement[4],
                quantity: detailElement[5],
                status: 'active',
                createdAt: this.getDate(),
                updatedAt: this.getDate()
              }).subscribe();
            }
          }
        }
      } catch (error) {
        console.error('Error handling product details:', error);
      }
    });

    await Promise.all(detailPromises);
  }

}
