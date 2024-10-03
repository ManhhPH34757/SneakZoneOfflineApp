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

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {

  totalPages: number = 0;  // Tổng số trang
  currentPage: number = 0;  // Trang hiện tại
  displayedPages: number[] = [];  // Mảng chứa các trang cần hiển thị

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

  editing: boolean = false;

  checkProductCode: boolean = true;
  checkProductName: boolean = true;
  checkBrand: boolean = true;
  checkCategory: boolean = true;
  checkMaterial: boolean = true;
  checkSole: boolean = true;

  ngOnInit(): void {
    this.productService.getAllProducts(0).subscribe((data) => {
      this.totalPages = data.result.totalPages;
      this.currentPage = 1;
      this.updateDisplayedPages();
      this.loadBrands();
      this.loadCategories();
      this.loadMaterials();
      this.loadSoles();
      this.loadProducts();
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

  loadProducts(): void {
    this.productService.getAllProducts(0).subscribe((data) => {
      this.products = data.result.content;
    });
  }

  onSubmit(): void {
    if (this.validation()) {
      console.log(this.validation());
      console.log(this.product);
      console.log(this.selectedFiles);
    }
  }

  onUpdate(): void {
    console.log(this.product);
    console.log(this.selectedFiles);
  }

  validation(): boolean {
    let productCode = document.getElementById('productCode') as HTMLInputElement;
    let productName = document.getElementById('productName') as HTMLInputElement;
    let brand = document.getElementById('brand') as HTMLSelectElement;
    let category = document.getElementById('category') as HTMLSelectElement;
    let material = document.getElementById('material') as HTMLSelectElement;
    let sole = document.getElementById('sole') as HTMLSelectElement;

    if (productCode.value.trim().length == 0) {
      this.checkProductCode = false;
    } else {
      this.checkProductCode = true;
    }

    if (productName.value.trim().length == 0) {
      this.checkProductName = false;
    } else {
      this.checkProductName = true;
    }

    if (brand.value == '') {
      this.checkBrand = false;
    } else {
      this.checkBrand = true;
    }

    if (category.value == '') {
      this.checkCategory = false;
    }

    if (this.checkProductCode && this.checkProductName && this.checkBrand && this.checkCategory && this.checkMaterial && this.checkSole) {
      return true;
    }

    return false;

  }

  openFilePicker(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  onSelectImages(event: any): void {
    const files: File[] = Array.from(event.target.files);

    if (files.length > 5) {
      alert('You can only select up to 5 images.');
      this.selectedFiles = [];
    } else {
      this.selectedFiles = files;
    }
  }

  edit(productEdit: ProductResponse) {
    this.productService.getProductById(productEdit.id).subscribe((data) => {
      this.product = data.result;
      const foundBrand = this.brands.find(
        (b) => b.id === this.product.idBrand.id
      );
      const foundCategory = this.categories.find(
        (c) => c.id === this.product.idCategory.id
      );
      const foundMaterial = this.materials.find(
        (m) => m.id === this.product.idMaterial.id
      );
      const foundSole = this.soles.find((s) => s.id === this.product.idSole.id);

      if (foundBrand) this.product.idBrand = foundBrand;
      if (foundCategory) this.product.idCategory = foundCategory;
      if (foundMaterial) this.product.idMaterial = foundMaterial;
      if (foundSole) this.product.idSole = foundSole;

      this.productImageService
        .getProductImagesById(productEdit.id)
        .subscribe((data) => {
          let images: any = data.result;

          let imageUrls: File[] = [];

          for (let index = 0; index < images.length; index++) {
            const element: ProductImage = images[index];

            const dummyFile = new File([new Blob()], element.images, {
              type: 'image/jpeg',
            });

            imageUrls.push(dummyFile);
          }

          this.selectedFiles = imageUrls;
        });

      this.editing = true;
    });
  }

  clear(): void {
    this.product = new ProductRequest();
    this.selectedFiles = [];
    this.editing = false;
  }

  updateDisplayedPages(): void {
    if (this.totalPages <= 5) {
      this.displayedPages = Array.from({ length: this.totalPages }, (_, index) => index + 1);
    } else {
      if (this.currentPage <= 3) {
        this.displayedPages = [1, 2, 3, 4, 5];
      } else if (this.currentPage >= this.totalPages - 2) {
        this.displayedPages = [
          this.totalPages - 4,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
      } else {
        // Nếu trang hiện tại nằm ở giữa, hiển thị các trang xung quanh trang hiện tại (2 trang trước, 2 trang sau)
        this.displayedPages = [
          this.currentPage - 2,
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          this.currentPage + 2,
        ];
      }
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updateDisplayedPages();
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

}
