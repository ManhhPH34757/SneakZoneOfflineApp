import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CustomerRequest } from '../../class/request/customer-request';
import { v4 as uuidv4 } from 'uuid';
import { CustomerResponse } from '../../class/response/customer-response';
import { FilterCustomer } from '../../class/request/filter-customer';
import { data } from 'jquery';
import { catchError, forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {

  constructor(
    private customerService: CustomerService) { }

  customers: CustomerResponse[] = [];
  customerEdit: CustomerRequest = new CustomerRequest();
  customer: CustomerRequest = new CustomerRequest();
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;
  currentPage: number = 0;
  displayedPages: number[] = [];
  editing: boolean = false;

  showAlertError: boolean = false;
  showAlertSuccess: boolean = false;
  alertMessage: string = '';

  checkCustomerCodeEmpty: boolean = true;
  checkCustomerCodeExists: boolean = true;
  checkPhoneNumberExitsts: boolean = true;
  checkPhoneNumberEmpty: boolean = true;
  checkPhoneNumberSize: boolean = true;
  checkEmail: boolean = true;
  checkEmailExists: boolean = true;

  filter: FilterCustomer = {};

  loadCustomer(data: any): void {
    this.customers = data.result.content;
  }
  resetForm() {
    this.customer = new CustomerRequest();
    this.editing = false;
    this.checkCustomerCodeEmpty = true;
    this.checkCustomerCodeExists = true;
    this.checkPhoneNumberExitsts = true;
    this.checkPhoneNumberEmpty = true;
    this.checkPhoneNumberSize = true;
    this.checkEmail = true;
    this.checkEmailExists = true;
  }
  ngOnInit(): void {
    this.customerService.getAllCustomers(0, this.size).subscribe((data) => {
      this.loadCustomer(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
    })
  }
  onSubmit(): void {
    this.customer.id = uuidv4();
    this.customer.accumulatedPoints = 0;
    this.customer.created_at = this.getDate();
    this.customer.updated_at = this.getDate();
    this.customer.customerCode = this.customer.customerCode.trim();
    this.customer.fullName = this.customer.fullName.trim();
    this.customer.phoneNumber = this.customer.phoneNumber.trim();
    this.customer.address = this.customer.address.trim();
    this.customer.email = this.customer.email.trim();


    this.validate().then((isValid) => {
      if (isValid) {
        this.customerService.createCustomer(this.customer).subscribe(() => {
          this.refreshCustomerList('success','Add successfully!')
        });
      }
    })
  }

  onUpdate(): void {
    this.validate().then((isValid) => {
      if (isValid) {
        this.customer.updated_at = this.getDate();
        this.customerService.updateCustomer(this.customer).subscribe(() => {
          this.refreshCustomerList('success','Update successfully!')
        })
      }
    })
  }
  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }

  edit(customerEdit: CustomerResponse): void {
    this.customerService.getCustomerById(customerEdit.id).subscribe((data) => {
      this.customer = data.result;
      this.customerEdit = {
        ... this.customer
      };
      console.log(this.customer);
      
      this.editing = true;
    })
  }

  private refreshCustomerList(alertType: string, alertMessage: string): void {
    this.customerService.getAllCustomers(0, this.size).subscribe((data) => {
      this.loadCustomer(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.resetForm();
      this.displayAlert(alertType, alertMessage);
    });
  }

  checkPhoneNumberValid(phone: string): boolean {
    const phonePattern = /^[0-9]{10,13}$/;
    return phonePattern.test(phone);
  };

  checkEmailValid(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  validate(): Promise<boolean> {
    let customerCode = (document.getElementById('customerCode') as HTMLInputElement).value.trim();
    let phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value.trim();
    let email = (document.getElementById('email') as HTMLInputElement).value.trim();

    const checkEmpty = (value: string): boolean => value.length > 0;

    this.checkCustomerCodeEmpty = checkEmpty(customerCode);
    this.checkPhoneNumberEmpty = checkEmpty(phoneNumber);
    
    if (this.checkPhoneNumberEmpty) {
      this.checkPhoneNumberSize = this.checkPhoneNumberValid(phoneNumber);
    }

    if (checkEmpty(email)) {
      this.checkEmail = this.checkEmailValid(email);
    }

    if (!this.checkCustomerCodeEmpty || !this.checkPhoneNumberEmpty || !this.checkPhoneNumberSize || !this.checkEmail) {
      this.checkCustomerCodeExists = true;
      this.checkPhoneNumberExitsts = true;
      this.checkEmailExists = true;
      return Promise.resolve(false);
    }

    let checks: Observable<{ result: boolean }>[] = [];
    
    if (!this.editing || (this.editing && customerCode !== this.customerEdit.customerCode)) {
      checks.push(this.customerService.checkExistsCustomerCode(customerCode).pipe(catchError(() => of({ result: false }))));
    } else {
      this.checkPhoneNumberExitsts = true;
    }

    if (!this.editing || (this.editing && phoneNumber !== this.customerEdit.phoneNumber)) {      
      checks.push(this.customerService.checkExistsPhoneNumber(phoneNumber).pipe(catchError(() => of({ result: false }))));
    } else {
      this.checkPhoneNumberExitsts = true;
    }

    if (!this.editing || (this.editing && email !== this.customerEdit.email)) {
      checks.push(this.customerService.checkExistsEmail(email).pipe(catchError(() => of({ result: false }))));
    } else {
      this.checkEmailExists = true;
    }

    return new Promise((resolve) => {

      if (checks.length === 0) {
        const validResult = this.checkCustomerCodeEmpty && this.checkPhoneNumberEmpty && this.checkEmail && this.checkPhoneNumberSize && this.checkCustomerCodeExists && this.checkPhoneNumberExitsts && this.checkEmailExists;
        resolve(validResult);
      } else {
        forkJoin(checks).subscribe((result) => {
          
          if (!this.editing || (this.editing && customerCode !== this.customerEdit.customerCode)) {
            this.checkCustomerCodeExists = !result[0].result;
          }

          if (!this.editing || (this.editing && phoneNumber !== this.customerEdit.phoneNumber)) {
            const size = checks.length;
            let index = 0;
            if (size == 1) {
              index = 0;
            } else if (size == 2) {
              index = 1;
            } else if (size == 3) {
              index = 1;
            }
            this.checkPhoneNumberExitsts = !result[index].result;
          }

          if (!this.editing || (this.editing && email !== this.customerEdit.email)) {
            const size = checks.length;
            let index = 0;
            if (size == 1) {
              index = 0;
            } else if (size == 2) {
              index = 1;
            } else if (size == 3) {
              index = 2;
            }
            this.checkEmailExists = !result[index].result;
          }
          console.log(this.checkPhoneNumberExitsts);
          
          const validResult = this.checkCustomerCodeEmpty && this.checkPhoneNumberEmpty && this.checkEmail && this.checkPhoneNumberSize && this.checkCustomerCodeExists && this.checkPhoneNumberExitsts && this.checkEmailExists;
          resolve(validResult);
        })
      }
    })
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

  getAll(): void {
    this.customerService.getAllCustomers(0, this.size).subscribe((data) => {
      this.loadCustomer(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.filter = {};
    });
  }

  filters(): void {
    console.log(this.filter)
    this.customerService.getAllCustomers(0, this.size, this.filter).subscribe((data) => {
      console.log(data);
      this.loadCustomer(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
    });
  }

  checkFilter(filter: FilterCustomer): boolean {
    for (const key in filter) {
      if (filter.hasOwnProperty(key) && filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
        return true;
      }
    }
    return false;
  }

  goToPage(page: number): void {
    if (page < 0 || page > this.totalPages) {
      return;
    }
    this.currentPage = page - 1;
    this.updateDisplayedPages();


    if (this.checkFilter(this.filter)) {
      this.customerService.getAllCustomers(this.currentPage, this.size, this.filter).subscribe((data) => {
        this.loadCustomer(data);
      });
    } else {
      this.customerService.getAllCustomers(this.currentPage, this.size).subscribe((data) => {
        this.loadCustomer(data);
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

  // changeSize() {
  //   if (this.checkFilter(this.filter)) {
  //     this.productService.getAllProducts(0, this.size, this.filter).subscribe((data) => {
  //       this.loadProducts(data);
  //       this.totalPages = data.result.totalPages;
  //       this.currentPage = 0;
  //       this.updateDisplayedPages();
  //     });
  //   } else {
  //     this.productService.getAllProducts(0, this.size).subscribe((data) => {
  //       this.loadProducts(data);
  //       this.totalPages = data.result.totalPages;
  //       this.currentPage = 0;
  //       this.updateDisplayedPages();
  //     });
  //   }
  // }


}
