import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../class/dto/sale';
import { data } from 'jquery';
import { v4 as uuidv4 } from 'uuid';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { FilterSale } from '../../class/request/filter-sale';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  constructor(private readonly saleService: SaleService) {}

  editing: boolean = false;

  sales: any;
  sale: Sale = new Sale();
  filter: FilterSale = {};

  checkSaleCode: boolean = true;
  checkSaleCodeExists: boolean = true;
  checkSaleName: boolean = true;
  checkStartDate: boolean = true;
  checkEndDate: boolean = true;
  checkStartDateValid: boolean = true;
  checkEndDateValid: boolean = true;

  showAlertError: boolean = false;
  alertMessage: string = '';
  showAlertSuccess: boolean = false;

  loadSales(): void {
    this.saleService.getAll().subscribe((data) => {
      this.sales = data.result;
    });
  }

  ngOnInit(): void {
    this.loadSales();
  }

  clear(): void {
    this.sale = new Sale();
    this.editing = false;
    this.checkSaleCode = true;
    this.checkSaleName = true;
    this.checkStartDate = true;
    this.checkEndDate = true;
    this.checkSaleCodeExists = true;
    this.checkEndDateValid = true;
    this.checkStartDateValid = true;
  }

  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }

  validation(): Promise<boolean> {
    let saleCode = (
      document.getElementById('saleCode') as HTMLInputElement
    ).value.trim();
    let saleName = (
      document.getElementById('saleName') as HTMLInputElement
    ).value.trim();
    let startDate = (
      document.getElementById('startDate') as HTMLInputElement
    ).value.trim();
    let endDate = (
      document.getElementById('endDate') as HTMLInputElement
    ).value.trim();

    const checkEmpty = (value: string): boolean => value.length > 0;

    this.checkSaleCode = checkEmpty(saleCode);
    this.checkSaleName = checkEmpty(saleName);
    this.checkStartDate = checkEmpty(startDate);
    this.checkEndDate = checkEmpty(endDate);

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (this.checkStartDate) {
      this.checkStartDateValid = start > now; 
    } 

    if (this.checkEndDate) {
      this.checkEndDateValid = end > now && end >= start; 
    } 
    
    return new Promise((resolve) => {
      this.saleService
        .checkexistsSaleCode(saleCode)
        .pipe(catchError(() => of({ result: false })))
        .subscribe((response) => {
          this.checkSaleCodeExists = !response.result; 

          const validResult =
            this.checkSaleCode && 
            this.checkSaleCodeExists && 
            this.checkStartDate && 
            this.checkStartDateValid && 
            this.checkEndDate && 
            this.checkEndDateValid; 

          resolve(validResult);
        });
    });
  }

  toggleStatus(sale: Sale): void {
    sale.isActive = !sale.isActive;
    this.saleService.updateSale(sale).subscribe({
      next: () => {
        console.log('Staff status updated successfully');
      },
      error: (err) => {
        console.error('Error updating staff status:', err);
      },
    });
  }

  onSubmit(): void {
    this.validation().then((isValid) => {
      if (isValid) {
        const id = uuidv4();
        this.sale.id = id;
        this.sale.createdAt = this.getDate();
        this.sale.updatedAt = this.getDate();
        this.sale.isActive = true;

        this.saleService.create(this.sale).subscribe((data) => {
          this.loadSales();
          this.clear();
          this.displayAlert('success', 'Create staff successfully');
        });
      }
    });
  }

  edit(saleEdit: Sale): void {
    this.saleService.getSaleById(saleEdit.id).subscribe((data) => {
      this.sale = data.result;

      if (this.sale.endDate) {
        const date = new Date(this.sale.endDate);
        this.sale.endDate = date.toISOString().slice(0, 16);
      }

      if (this.sale.startDate) {
        const date = new Date(this.sale.startDate);
        this.sale.startDate = date.toISOString().slice(0, 16);
      }

      this.editing = true;
    });
  }

  onUpdate(): void {
    this.sale.updatedAt = this.getDate();

    if (this.sale.endDate) {
      const date = new Date(this.sale.endDate);
      this.sale.endDate = date.toISOString().slice(0, 16);
    }

    if (this.sale.startDate) {
      const date = new Date(this.sale.startDate);
      this.sale.startDate = date.toISOString().slice(0, 16);
    }

    this.saleService.updateSale(this.sale).subscribe((data) => {
      this.loadSales();
      this.clear();
      this.displayAlert('success', 'Update staff successfully');
    });
  }

  delete(sale: Sale): void {
    const access_token: any = localStorage.getItem('access_token');
    const decodedToken: any = jwtDecode(access_token);

    if (decodedToken.scope !== 'ADMIN') {
      alert('Bạn không có quyền xóa bản ghi này!');
      return;
    }

    if (confirm('Bạn có muốn xóa không ?')) {
      this.saleService.delete(sale.id).subscribe((data) => {
        this.loadSales();
        this.clear();
      });
    }
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

  loadSaless(data: any): void {
    this.sales = data.result;
  }

  filters(): void {
    this.saleService.getAll(this.filter).subscribe((data) => {
      this.loadSaless(data);
    });
  }

  getAll(): void {
    this.saleService.getAll().subscribe((data) => {
      this.loadSaless(data);
    });
  }

  formatDate(dateString: string): string {
    return dateString.replace('T', ' ').replace('Z', '');
  }
}
