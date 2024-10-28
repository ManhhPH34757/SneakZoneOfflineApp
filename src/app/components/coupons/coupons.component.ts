import { Component, OnInit } from '@angular/core';
import { CouponsService } from '../../services/coupons.service';
import { Coupons } from '../../class/dto/coupons';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import { data } from 'jquery';
import { FilterCoupon } from '../../class/request/filter-coupons';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.css'
})
export class CouponsComponent implements OnInit {

  constructor(
    private couponService: CouponsService
  ){}
  coupons: any;
  coupon: Coupons = new Coupons();
  editing: boolean = false;
  filter: FilterCoupon = {};

  checkCouponsCode: boolean = true;
  checkCouponsName: boolean = true;
  checkCouponsStartDate: boolean = true;
  checkCouponsEndDate: boolean = true;
  checkCouponsConditions: boolean = true;
  checkCouponsPrice: boolean = true;

  errorMsgCouponsCode: string = '';
  errorMsgCouponsName: string = '';
  errorMsgCouponsStartDate: string = '';
  errorMsgCouponsEndDate: string = '';
  errorMsgCouponsConditions: string = '';
  errorMsgCouponsPrice: string = '';

  showAlertError: boolean = false;
  showAlertSuccess: boolean = false;
  alertMessage: string = '';

  role: boolean = false;

  loadCoupon(): void{
    this.couponService.getAll().subscribe((data) => {
      this.coupons = data.result;
  })}


  loadCoupons(data:any): void{
    this.coupons = data.result;
  }

  ngOnInit(): void {
    const access_token: any = localStorage.getItem('access_token');
    let decoded: any = jwtDecode(access_token);
    if(decoded.scope == 'ADMIN'){
      this.role = true;
    }else{
      this.role = false;
    }
    this.loadCoupon();
  }
  clear(): void{
    this.coupon = new Coupons();
    this.checkCouponsCode = true;
    this.checkCouponsName = true;
    this.checkCouponsStartDate = true;
    this.checkCouponsEndDate = true;
    this.editing = false;

  }
  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }
  toggleStatus(coupon: Coupons): void {
    coupon.isActive = !coupon.isActive;
    this.couponService.updateCoupon(coupon).subscribe({
      next: () => {
        console.log('Staff status updated successfully');
      },
      error: (err) => {
        console.error('Error updating staff status:', err);
      },
    });
  }
  onSubmit(): void{
    this.coupon.id = uuidv4();
    this.coupon.createdAt = this.getDate();
    this.coupon.updatedAt = this.getDate();
    this.coupon.isActive = true;

    console.log(
      this.checkCouponsName ,
      this.checkCouponsStartDate ,
      this.checkCouponsEndDate,
      this.checkCouponsConditions,
      this.checkCouponsPrice
    )
     
    if(this.validationCreate()){
      console.log(
        this.checkCouponsName ,
        this.checkCouponsStartDate ,
        this.checkCouponsEndDate,
        this.checkCouponsConditions,
        this.checkCouponsPrice
      )
      this.couponService.createCoupon(this.coupon).subscribe(() => {
        this.loadCoupon();
        this.clear();
        this.displayAlert('success','Create coupons successfully');

      })
    }


  }

  onUpdate(): void {
    this.coupon.updatedAt = this.getDate();

    if (this.coupon.endDate) {
      const date = new Date(this.coupon.endDate);
      this.coupon.endDate = date.toISOString().slice(0, 16);
    }

    if (this.coupon.startDate) {
      const date = new Date(this.coupon.startDate);
      this.coupon.startDate = date.toISOString().slice(0, 16);
    }

    this.couponService.updateCoupon(this.coupon).subscribe((data) => {
      this.loadCoupon();
      this.clear();
      this.displayAlert('success', 'Update coupons successfully');
    });
  }

  edit(couponEdit: Coupons): void{
    this.couponService.getCouponById(couponEdit.id).subscribe((data) => {
      this.coupon = data.result;

      if(this.coupon.endDate){
        const data = new Date(this.coupon.endDate);
        this.coupon.endDate = data.toISOString().slice(0, 16);
      }
      
      if(this.coupon.startDate){
        const data = new Date(this.coupon.startDate);
        this.coupon.startDate = data.toISOString().slice(0, 16);
      }

      this.editing  = true;
    })
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

  delete(coupon: Coupons): void {
    const access_token: any = localStorage.getItem('access_token');
    const decodedToken: any = jwtDecode(access_token);

    if (decodedToken.scope !== 'ADMIN') {
      alert('Bạn không có quyền xóa bản ghi này!');
      return;
    }

    if (confirm('Bạn có muốn xóa không ?')) {
      this.couponService.delete(coupon.id).subscribe((data) => {
        this.loadCoupon();
        this.clear();
      });
    }
  }

  checkDuplicateCouponsCode(couponsCode: string): boolean {
    return this.coupons.some((coupon: Coupons) => coupon.couponsCode === couponsCode);
  }
  checkDuplicateCouponsName(couponsName: string): boolean {
    return this.coupons.some((coupon: Coupons) => coupon.couponsName === couponsName);
  }

  validationCreate(): boolean {
    let couponsCode = (document.getElementById('couponsCode') as HTMLInputElement).value.trim();
    let couponsName = (document.getElementById('couponsName') as HTMLInputElement).value.trim();
    
    // let conditions = (document.getElementById('conditions') as HTMLInputElement).value.trim();
    // let couponsPrice = (document.getElementById('couponsPrice') as HTMLInputElement).value.trim();
    let startDate = (document.getElementById('startDate') as HTMLInputElement).value.trim();
    console.log(startDate);
    let endDate = (document.getElementById('endDate') as HTMLInputElement).value.trim();
    console.log(endDate);
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    const currentTime = new Date();
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    if (couponsCode.length == 0) {
      this.checkCouponsCode = false;
      this.errorMsgCouponsCode = '* Coupons code is required.';
    } else if (couponsCode.length > 10 || !alphanumericRegex.test(couponsCode)) {
      this.checkCouponsCode = false;
      this.errorMsgCouponsCode = '* Coupons code must be alphanumeric and less than or equal to 10 characters.';
    } else if (this.checkDuplicateCouponsCode(couponsCode)) {
      this.checkCouponsCode = false;
      this.errorMsgCouponsCode = '* Duplicate Coupons Code';
    } else {
      this.checkCouponsCode = true;
      this.errorMsgCouponsCode = '';
    }

    if (couponsName.length == 0) {
      this.checkCouponsName = false;
      this.errorMsgCouponsName = '* Coupons name is required.';
    } else if (couponsName.length > 255) {
      this.checkCouponsName = false;
      this.errorMsgCouponsName = '* Coupons name must be less than or equal to 255 characters.';
    } else if (this.checkDuplicateCouponsName(couponsName)) {
      this.checkCouponsName = false;
      this.errorMsgCouponsName = '* Duplicate Coupons Name';
    } else {
      this.checkCouponsName = true;
      this.errorMsgCouponsName = '';
    }

    // if (conditions.length == 0){
    //   this.checkCouponsConditions = false;
    //   this.errorMsgCouponsConditions = '* Conditions is required.';
    // } else {
    //   this.checkCouponsConditions = true;
    //   this.errorMsgCouponsConditions = '';
    // }

    // if(couponsPrice.length == 0){
    //   this.checkCouponsPrice = false;
    //   this.errorMsgCouponsPrice = '* Coupons price is required.';
    // } else {
    //   this.checkCouponsPrice = true;
    //   this.errorMsgCouponsPrice = '';
    // }

    if(!startDate){
      this.checkCouponsStartDate = false;
      this.errorMsgCouponsStartDate = '* Start date is required.'
    } else if(startDateTime < currentTime){
      this.checkCouponsStartDate = false;
      this.errorMsgCouponsStartDate = '* Start date must be greater than or equal to current date';
    }  else {
      this.checkCouponsStartDate = true;
      this.errorMsgCouponsStartDate = '';
    }

    if(!endDate){
      this.checkCouponsEndDate = false;
      this.errorMsgCouponsEndDate = '* End date is required.'
    } else if(endDateTime < currentTime){
      this.checkCouponsEndDate = false;
      this.errorMsgCouponsEndDate = '* End date must be greater than or equal to current date';
    } else if(endDateTime < startDateTime){
      this.checkCouponsEndDate = false;
      this.errorMsgCouponsEndDate= '* The end date must be greater than the creation date';
    } else {
      this.checkCouponsEndDate = true;
      this.errorMsgCouponsEndDate = '';
    }
    console.log(
      this.checkCouponsName ,
      this.checkCouponsStartDate ,
      this.checkCouponsEndDate,
      this.checkCouponsConditions,
      this.checkCouponsPrice
    )
    if (this.checkCouponsCode 
      && this.checkCouponsName 
      && this.checkCouponsStartDate 
      && this.checkCouponsEndDate
      && this.checkCouponsConditions
      && this.checkCouponsPrice
    ) {
      return true;
    }
    return false;
    
  }

  filters(): void {
    this.couponService.getAll(this.filter).subscribe((data) => {
      console.log(data);
      this.loadCoupons(data);

    })
  }

  formatDate(dateString: string): string {
    return dateString.replace('T', ' ').replace('Z', '');
  }

}
