import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { data } from 'jquery';
import { StaffResponse } from '../../class/response/staff-response';
import { StaffRequest } from '../../class/request/staff-request';
import { v4 as uuidv4 } from 'uuid';
import { FilterStaff } from '../../class/request/filter-staff';
import { catchError, forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  constructor(private fb: FormBuilder, private staffService: StaffService) {}

  size: number = 5;
  totalPages: number = 0;
  currentPage: number = 0;
  displayedPages: number[] = [];

  checkstaffCode: boolean = true;
  checkstaffCodeExists: boolean = true;
  checkfullName: boolean = true;
  checkgender: boolean = true;
  checkbirthday: boolean = true;
  checkphoneNumber: boolean = true;
  checkphoneNumberSize: boolean = true;
  checkphoneNumberExists: boolean = true;
  checkaddress: boolean = true;
  checkemail: boolean = true;
  checkemailExists: boolean = true;
  checkemailSize: boolean = true;
  checkusername: boolean = true;
  checkusernameExists: boolean = true;
  checkrole: boolean = true;
  editing: boolean = false;

  showAlertError: boolean = false;
  showAlertSuccess: boolean = false;
  alertMessage: string = '';

  staffs: StaffResponse[] = [];
  staff: StaffRequest = new StaffRequest();
  filter: FilterStaff = {};
  staffEditing: StaffRequest = new StaffRequest();

  loadStaff(): void {
    this.staffService.getStaff(0, this.size).subscribe((data) => {
      this.staffs = data.result.content;
    });
  }

  loadStaffs(data: any): void {
    this.staffs = data.result.content;
  }

  ngOnInit(): void {
    this.staffService.getStaff(0, this.size).subscribe((data) => {
      this.loadStaffs(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
    });
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

  validation(): Promise<boolean> {
    const checkPhoneNumberValid = (phone: string): boolean => {
      const phonePattern = /^[0-9]{10,13}$/;
      return phonePattern.test(phone);
    };

    const checkEmailValid = (email: string): boolean => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };

    let staffCode = (
      document.getElementById('staffCode') as HTMLInputElement
    ).value.trim();
    let fullName = (
      document.getElementById('fullName') as HTMLInputElement
    ).value.trim();
    let gender = (
      document.querySelector('input[name="gender"]:checked') as HTMLInputElement
    )?.value;
    let birthday = (document.getElementById('birthday') as HTMLInputElement)
      .value;
    let phoneNumber = (
      document.getElementById('phoneNumber') as HTMLInputElement
    ).value;
    let address = (document.getElementById('address') as HTMLInputElement)
      .value;
    let email = (document.getElementById('email') as HTMLInputElement).value;
    let username = (document.getElementById('username') as HTMLInputElement)
      .value;
    let role = (
      document.querySelector('input[name="role"]:checked') as HTMLInputElement
    )?.value;

    const checkEmpty = (value: string): boolean => value.length > 0;

    this.checkstaffCode = checkEmpty(staffCode);
    this.checkfullName = checkEmpty(fullName);
    this.checkgender = gender ? true : false;
    this.checkbirthday = checkEmpty(birthday);
    this.checkphoneNumber = checkEmpty(phoneNumber);
    this.checkaddress = checkEmpty(address);
    this.checkemail = checkEmpty(email);
    this.checkusername = checkEmpty(username);
    this.checkrole = role ? true : false;

    if (checkEmpty(phoneNumber)) {
      this.checkphoneNumberSize = checkPhoneNumberValid(phoneNumber);
    }

    if (checkEmpty(email)) {
      this.checkemailSize = checkEmailValid(email);
    }

    if (
      !this.checkstaffCode ||
      !this.checkfullName ||
      !this.checkgender ||
      !this.checkbirthday ||
      !this.checkphoneNumber ||
      !this.checkaddress ||
      !this.checkemail ||
      !this.checkusername ||
      !this.checkrole ||
      !this.checkphoneNumberSize ||
      !this.checkemailSize
    ) {
      this.checkstaffCodeExists = true;
      this.checkphoneNumberExists = true;
      this.checkemailExists = true;
      this.checkusernameExists = true;
      return Promise.resolve(false);
    }

    const checks: Observable<{ result: boolean }>[] = [];

    if (
      !this.editing ||
      (this.editing && this.staffEditing.staffCode !== staffCode)
    ) {
      checks.push(
        this.staffService
          .checkexistsStaffCode(staffCode)
          .pipe(catchError(() => of({ result: false })))
      );
    } else {
      this.checkstaffCodeExists = true;
    }

    if (
      !this.editing ||
      (this.editing && this.staffEditing.phoneNumber !== phoneNumber)
    ) {
      checks.push(
        this.staffService
          .checkexistsPhoneNumber(phoneNumber)
          .pipe(catchError(() => of({ result: false })))
      );
    } else {
      this.checkphoneNumberExists = true;
    }

    if (!this.editing || (this.editing && this.staffEditing.email !== email)) {
      checks.push(
        this.staffService
          .checkexistsEmail(email)
          .pipe(catchError(() => of({ result: false })))
      );
    } else {
      this.checkemailExists = true;
    }

    if (
      !this.editing ||
      (this.editing && this.staffEditing.username !== username)
    ) {
      checks.push(
        this.staffService
          .checkexistsUsername(username)
          .pipe(catchError(() => of({ result: false })))
      );
    } else {
      this.checkusernameExists = true;
    }

    return new Promise((resolve) => {
      if (checks.length === 0) {
        const validResult =
          this.checkstaffCode &&
          this.checkfullName &&
          this.checkgender &&
          this.checkbirthday &&
          this.checkphoneNumber &&
          this.checkaddress &&
          this.checkemail &&
          this.checkusername &&
          this.checkrole &&
          this.checkphoneNumberSize &&
          this.checkemailSize &&
          this.checkstaffCodeExists &&
          this.checkphoneNumberExists &&
          this.checkusernameExists &&
          this.checkemailExists;
        resolve(validResult);
      } else {
        forkJoin(checks).subscribe((result) => {
          if (
            !this.editing ||
            (this.editing && this.staffEditing.staffCode !== staffCode)
          ) {
            this.checkstaffCodeExists = !result[0].result;
          }

          if (
            !this.editing ||
            (this.editing && this.staffEditing.phoneNumber !== phoneNumber)
          ) {
            let size = checks.length;

            if (size == 1) {
              this.checkphoneNumberExists = !result[0].result;
            } else {
              this.checkphoneNumberExists = !result[1].result;
            }
          }

          if (
            !this.editing ||
            (this.editing && this.staffEditing.email !== email)
          ) {
            let size = checks.length;

            if (size == 1) {
              this.checkemailExists = !result[0].result;
            } else if (size == 2) {
              this.checkemailExists = !result[1].result;
            } else {
              this.checkemailExists = !result[2].result;
            }
          }

          if (
            !this.editing ||
            (this.editing && this.staffEditing.username !== username)
          ) {
            let size = checks.length;

            if (size == 1) {
              this.checkusernameExists = !result[0].result;
            } else if (size == 2) {
              this.checkusernameExists = !result[1].result;
            } else if (size == 3) {
              this.checkusernameExists = !result[2].result;
            } else if (size == 4) {
              this.checkusernameExists = !result[3].result;
            }
          }

          const validResult =
            this.checkstaffCode &&
            this.checkfullName &&
            this.checkgender &&
            this.checkbirthday &&
            this.checkphoneNumber &&
            this.checkaddress &&
            this.checkemail &&
            this.checkusername &&
            this.checkrole &&
            this.checkphoneNumberSize &&
            this.checkemailSize &&
            this.checkstaffCodeExists &&
            this.checkphoneNumberExists &&
            this.checkusernameExists &&
            this.checkemailExists;
          resolve(validResult);
        });
      }
    });
  }

  onSubmit() {
    this.validation().then((isValid) => {
      if (isValid) {
        const id = uuidv4();
        this.staff.id = id;
        this.staff.password = '123456';
        this.staff.createdAt = this.getDate();
        this.staff.isActive = true;
        this.staffService.createStaff(this.staff).subscribe({
          next: () => {
            this.loadStaff();
            this.clear();
            this.displayAlert('success', 'Create staff successfully');
          },
          error: (err) => {
            console.log('Error creating staff:', err);
          },
        });
      }
    });
  }

  clear(): void {
    this.staff = new StaffRequest();
    this.checkstaffCode = true;
    this.checkstaffCodeExists = true;
    this.checkfullName = true;
    this.checkgender = true;
    this.checkbirthday = true;
    this.checkphoneNumber = true;
    this.checkphoneNumberSize = true;
    this.checkphoneNumberExists = true;
    this.checkaddress = true;
    this.checkemail = true;
    this.checkemailExists = true;
    this.checkemailSize = true;
    this.checkusername = true;
    this.checkusernameExists = true;
    this.checkrole = true;
    this.editing = false;
  }

  edit(staffEdit: StaffResponse): void {
    this.staffService.getStaffById(staffEdit.id).subscribe((data) => {
      this.staff = data.result;
      this.staffEditing = {
        ...this.staff,
      };
      this.editing = true;
    });
  }

  onUpdate(): void {
    this.validation().then((isValid) => {
      if (isValid) {
        this.staff.updatedAt = this.getDate();
        this.staffService.updateStaff(this.staff).subscribe({
          next: () => {
            this.loadStaff();
            this.clear();
            this.displayAlert('success', 'Update staff successfully');
          },
          error: (err) => {
            console.error('Cập nhật thất bại: ', err);
          },
        });
      }
    });
  }

  getDate(): string {
    const timezoneOffsetInMillis = 7 * 60 * 60 * 1000;
    return new Date(
      new Date().getTime() + timezoneOffsetInMillis
    ).toISOString();
  }

  getAll(): void {
    this.staffService.getStaff(0, this.size).subscribe((data) => {
      this.loadStaffs(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
      this.filter = {};
    });
  }

  filters(): void {
    this.staffService.getStaff(0, this.size, this.filter).subscribe((data) => {
      this.loadStaffs(data);
      this.totalPages = data.result.totalPages;
      this.currentPage = 0;
      this.updateDisplayedPages();
    });
  }

  toggleStatus(staff: StaffResponse): void {
    staff.isActive = !staff.isActive;
    this.staffService.updateStaff(staff).subscribe({
      next: () => {
        console.log('Staff status updated successfully');
      },
      error: (err) => {
        console.error('Error updating staff status:', err);
      },
    });
  }

  checkFilter(filter: FilterStaff): boolean {
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
      this.staffService
        .getStaff(this.currentPage, this.size, this.filter)
        .subscribe((data) => {
          this.loadStaffs(data);
        });
    } else {
      this.staffService
        .getStaff(this.currentPage, this.size)
        .subscribe((data) => {
          this.loadStaffs(data);
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
}
