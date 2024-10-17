import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../class/dto/category';
import { BrandService } from '../../services/brand.service';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService
  ) { }

  categories: any;
  category: Category = new Category();
  editing: boolean = false;

  checkCategoryCode: boolean = true;
  checkCategoryName: boolean = true;
  checkCategoryDescription: boolean = true;

  errorMsgCategoryCode: string = '';
  errorMsgCategoryName: string = '';
  errorMsgDescription: string = '';
  showAlertSuccess: boolean = false;
  showAlertError: boolean = false;
  alertMessage: string = '';
  role: boolean = false;

  loadCategory(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.result;
    })
  }

  ngOnInit(): void {
    const access_token: any = localStorage.getItem('access_token');
    let decoded: any = jwtDecode(access_token);
    if (decoded.scope == 'ADMIN') {
      this.role = true;
    } else {
      this.role = false;
    }
    this.loadCategory();
  }

  clear(): void {
    this.category = new Category();
    this.editing = false;
  }

  onSubmit() {
    const id = uuidv4();
    this.category.id = id;
    this.category.categoryCode = this.category.categoryCode.trim();
    this.category.categoryName = this.category.categoryName.trim();
    if (this.validationCreate()) {
      this.categoryService.createCategory(this.category).subscribe(() => {
        this.loadCategory();
        this.clear();
      });
    }
  }

  onUpdate(): void {
    this.category.categoryName = this.category.categoryName.trim();
    if (this.validationUpdate()) {
      this.categoryService.updateCategory(this.category).subscribe(() => {
        this.loadCategory();
        this.clear();
      });
    }
  }

  delete(category: Category): void {
    this.productService.checkExistsByIdCategory(category.id).subscribe(data => {
      if (data.result) {
        this.displayAlert('error', 'Cannot delete category because it has product(s)');
      } else {
        if (confirm('Bạn có chắc muốn xóa không?')) {
          this.categoryService.deleteCategory(category.id).subscribe(() => {
            this.loadCategory();
          });
        }
      }
    });
  }

  edit(categoryEdit: Category): void {
    this.categoryService.getCategoryById(categoryEdit.id).subscribe((data) => {
      this.category = data.result;
      this.editing = true;
    })
  }
  checkDuplicateCategoryCode(categoryCode: string): boolean {
    return this.categories.some((category: Category) => category.categoryCode === categoryCode);
  }

  checkDuplicateCategoryName(categoryName: string): boolean {
    return this.categories.some((category: Category) => category.categoryName === categoryName);
  }

  checkDuplicateCategoryNameUpdate(categoryName: string): boolean {
    return this.categories.some((category: Category) => category.categoryName === categoryName && category.id !== this.category.id);
  }

  validationCreate(): boolean {
    let categoryCode = (document.getElementById('categoryCode') as HTMLInputElement).value.trim();
    let categoryName = (document.getElementById('categoryName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();

    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    if (categoryCode.length == 0) {
      this.checkCategoryCode = false;
      this.errorMsgCategoryCode = 'Category code is required.';
    }
    else if (categoryCode.length > 10 || !alphanumericRegex.test(categoryCode)) {
      this.checkCategoryCode = false;
      this.errorMsgCategoryCode = 'Category code must be alphanumeric and less than or equal to 10 characters.';
    } else if (this.checkDuplicateCategoryCode(categoryCode)) {
      this.checkCategoryCode = false;
      this.errorMsgCategoryCode = 'Dulicate Category Code';
    } else {
      this.checkCategoryCode = true;
      this.errorMsgCategoryCode = '';
    }

    if (categoryName.length == 0) {
      this.checkCategoryName = false;
      this.errorMsgCategoryName = 'Category name is required.';
    } else if (categoryName.length > 30) {
      this.checkCategoryName = false;
      this.errorMsgCategoryName = 'Category name must be alphanumeric and less than or equal to 30 characters.';
    } else if (this.checkDuplicateCategoryName(categoryName)) {
      this.checkCategoryName = false;
      this.errorMsgCategoryName = 'Dulicate Category Name';
    } else {
      this.checkCategoryName = true;
      this.errorMsgCategoryName = '';
    }

    if (description.length > 255) {
      this.checkCategoryDescription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkCategoryDescription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkCategoryCode && this.checkCategoryName && this.checkCategoryDescription) {
      return true;
    }
    return false;
  }

  validationUpdate(): boolean {
    let categoryName = (document.getElementById('categoryName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();

    if (categoryName.length == 0) {
      this.checkCategoryName = false;
      this.errorMsgCategoryName = 'Category name is required.';
    } else if (categoryName.length > 30) {
      this.checkCategoryName = false;
      this.errorMsgCategoryName = 'Category name must be alphanumeric and less than or equal to 30 characters.';
    } else if (this.checkDuplicateCategoryNameUpdate(categoryName)) {
      this.checkCategoryName = false;
      this.errorMsgCategoryName = 'Dulicate Category Name';
    } else {
      this.checkCategoryName = true;
      this.errorMsgCategoryName = '';
    }

    if (description.length > 255) {
      this.checkCategoryDescription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkCategoryDescription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkCategoryName && this.checkCategoryDescription) {
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
