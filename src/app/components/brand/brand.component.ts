import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../class/dto/brand';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from '../../services/product.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  constructor(
    private readonly brandService: BrandService,
    private readonly productService: ProductService
  ) { }

  brands: Brand[] = [];
  brand: Brand = new Brand();
  editing: boolean = false;
  checkBrandCode: boolean = true;
  checkBrandName: boolean = true;
  checkBrandDescription: boolean = true;
  errorMsgBrandCode: string = '';
  errorMsgBrandName: string = '';
  errorMsgDescription: string = '';
  showAlertSuccess: boolean = false;
  showAlertError: boolean = false;
  alertMessage: string = '';
  role: boolean = false;


  loadBrand(): void {
    this.brandService.getAllBrands().subscribe(data => {
      this.brands = data.result;
    });

  }

  ngOnInit(): void {
    const access_token: any = localStorage.getItem('access_token');
    let decoded: any = jwtDecode(access_token);
    if (decoded.scope == 'ADMIN') {
      this.role = true;
    } else {
      this.role = false;
    }
    this.loadBrand();
  }

  onSubmit(): void {
    const id = uuidv4();
    this.brand.id = id;
    this.brand.brandCode = this.brand.brandCode.trim();
    this.brand.brandName = this.brand.brandName.trim();
    if (this.validationCreate()) {
      this.brandService.createBrand(this.brand).subscribe(() => {
        this.loadBrand();
        this.clear();
      });
    }
  }

  onUpdate(): void {
    this.brand.brandName = this.brand.brandName.trim();
    if (this.validationUpdate()) {
      this.brandService.updateBrand(this.brand).subscribe(() => {
        this.loadBrand();
        this.clear();
      });
    }
  }

  delete(brand: Brand): void {
    this.productService.checkExistsByIdBrand(brand.id).subscribe(data => {
      if (data.result) {
        this.displayAlert('error', 'Cannot delete brand because it has product(s)');
      } else
        if (confirm('Bạn có chắc muốn xóa không?')) {
          this.brandService.deleteBrand(brand.id).subscribe(() => {
            this.loadBrand();
            this.displayAlert('success', 'Deleted success');
          });
        }
    })
  }

  edit(brandEdit: Brand): void {
    this.brandService.getBrandById(brandEdit.id).subscribe(data => {
      this.brand = data.result;
      this.editing = true;
    });
  }


  clear(): void {
    this.brand = new Brand();
    this.editing = false;
  }

  checkDuplicateBrandCode(brandCode: string): boolean {
    return this.brands.some((brand: Brand) => brand.brandCode === brandCode);
  }
  checkDuplicateBrandName(brandName: string): boolean {
    return this.brands.some((brand: Brand) => brand.brandName === brandName);
  }
  checkDuplicateBrandNameUpdate(brandName: string): boolean {
    return this.brands.some((brand: Brand) => brand.brandName === brandName && brand.id !== this.brand.id);
  }

  validationCreate(): boolean {
    let brandCode = (document.getElementById('brandCode') as HTMLInputElement).value.trim();
    let brandName = (document.getElementById('brandName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (brandCode.length == 0) {
      this.checkBrandCode = false;
      this.errorMsgBrandCode = 'Brand code is required.';
    } else if (brandCode.length > 10 || !alphanumericRegex.test(brandCode)) {
      this.checkBrandCode = false;
      this.errorMsgBrandCode = 'Brand code must be alphanumeric and less than or equal to 10 characters.';
    } else if (this.checkDuplicateBrandCode(brandCode)) {
      this.checkBrandCode = false;
      this.errorMsgBrandCode = 'Duplicate Brand Code';
    } else {
      this.checkBrandCode = true;
      this.errorMsgBrandCode = '';
    }

    if (brandName.length == 0) {
      this.checkBrandName = false;
      this.errorMsgBrandName = 'Brand name is required.';
    } else if (brandName.length > 30) {
      this.checkBrandName = false;
      this.errorMsgBrandName = 'Brand name must be less than or equal to 30 characters.';
    } else if (this.checkDuplicateBrandName(brandName)) {
      this.checkBrandName = false;
      this.errorMsgBrandName = 'Duplicate Brand Name';
    } else {
      this.checkBrandName = true;
      this.errorMsgBrandName = '';
    }

    if (description.length > 255) {
      this.checkBrandDescription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkBrandDescription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkBrandCode && this.checkBrandName && this.checkBrandDescription) {
      return true;
    }
    return false;
  }

  validationUpdate(): boolean {
    let brandName = (document.getElementById('brandName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();

    if (brandName.length == 0) {
      this.checkBrandName = false;
      this.errorMsgBrandName = 'Brand name is required.';
    } else if (brandName.length > 30) {
      this.checkBrandName = false;
      this.errorMsgBrandName = 'Brand name must be less than or equal to 30 characters.';
    } else if (this.checkDuplicateBrandNameUpdate(brandName)) {
      this.checkBrandName = false;
      this.errorMsgBrandName = 'Duplicate Brand Name';
    } else {
      this.checkBrandName = true;
      this.errorMsgBrandName = '';
    }

    if (description.length > 255) {
      this.checkBrandDescription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkBrandDescription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkBrandName && this.checkBrandDescription) {
      return true;
    }
    return false;
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
}
