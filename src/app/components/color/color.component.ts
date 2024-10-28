import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { Color } from '../../class/dto/color';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrl: './color.component.css'
})
export class ColorComponent implements OnInit {
  constructor(
    private readonly colorService: ColorService
  ) { }
  colors: any;
  color: Color = new Color();
  editing: boolean = false;

  checkColorCode: boolean = true;
  checkColorName: boolean = true;
  checkColorDescription: boolean = true;

  errorMsgColorCode: string = '';
  errorMsgColorName: string = '';
  errorMsgDescription: string = '';
  showAlertSuccess: boolean = false;
  showAlertError: boolean = false;
  alertMessage: string = '';
  role: boolean = false;

  loadColor(): void {
    this.colorService.getAllColor().subscribe((data) => {
      this.colors = data.result;
    })
  }

  ngOnInit(): void {
    const access_token: any = localStorage.getItem('access_token');
    let decoded: any = jwtDecode(access_token);
    if(decoded.scope == 'ADMIN'){
      this.role = true;
    }else{
      this.role = false;
    }
    this.colorService.getAllColor().subscribe((data) => {
      this.loadColor();
    })
  }

  onSubmit() {
    const id = uuidv4();
    this.color.id = id;
    this.color.colorCode = this.color.colorCode.trim();
    this.color.colorName = this.color.colorName.trim();
    if (this.validationCreate()) {
      this.colorService.createColor(this.color).subscribe(() => {
        this.loadColor();
        this.clear();
      });
    }
  }

  onUpdate(): void {
    this.color.colorName = this.color.colorName.trim();
    if (this.validationUpdate()) {
      this.colorService.updateColor(this.color).subscribe(() => {
        this.loadColor();
        this.clear();
      });
    }
  }

  delete(color: Color): void {
      if (confirm('Bạn có chắc muốn xóa không?')) {
        this.colorService.deleteColor(color.id).subscribe(() => {
          this.loadColor();
        });
      }
  }

  edit(colorEdit: Color): void {
    this.colorService.getColorById(colorEdit.id).subscribe((data) => {
      this.color = data.result;
      this.editing = true;
    })
  }

  clear(): void {
    this.color = new Color();
    this.editing = false;
  }

  checkDuplicateColorCode(colorCode: string): boolean {
    return this.colors.some((color: Color) => color.colorCode === colorCode);
  }

  checkDuplicateColorName(colorName: string): boolean {
    return this.colors.some((color: Color) => color.colorName === colorName);
  }

  checkDuplicateColorNameUpdate(colorName: string): boolean {
    return this.colors.some((color: Color) => color.colorName === colorName && color.id !== this.color.id);
  }

  validationCreate(): boolean {
    let colorCode = (document.getElementById('colorCode') as HTMLInputElement).value.trim();
    let colorName = (document.getElementById('colorName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    if (colorCode.length == 0) {
      this.checkColorCode = false;
      this.errorMsgColorCode = 'Color code is required.';
    } else if (colorCode.length > 10 || !alphanumericRegex.test(colorCode)) {
      this.checkColorCode = false;
      this.errorMsgColorCode = 'Color code must be alphanumeric and less than or equal to 10 characters.';
    } else if (this.checkDuplicateColorCode(colorCode)) {
      this.checkColorCode = false;
      this.errorMsgColorCode = 'Duplicate Color Code';
    } else {
      this.checkColorCode = true;
      this.errorMsgColorCode = '';
    }

    if (colorName.length == 0) {
      this.checkColorName = false;
      this.errorMsgColorName = 'Color name is required.';
    } else if (colorName.length > 30) {
      this.checkColorName = false;
      this.errorMsgColorName = 'Color name must be less than or equal to 30 characters.';
    } else if (this.checkDuplicateColorName(colorName)) {
      this.checkColorCode = false;
      this.errorMsgColorName = 'Duplicate Color Name';
    } else {
      this.checkColorName = true;
      this.errorMsgColorName = '';
    }

    if (description.length > 255) {
      this.checkColorDescription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkColorDescription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkColorCode && this.checkColorName && this.checkColorDescription) {
      return true;
    }
    return false;
  }

  validationUpdate(): boolean {
    let colorName = (document.getElementById('colorName') as HTMLInputElement).value.trim();
    let description = (document.getElementById('description') as HTMLInputElement).value.trim();

    if (colorName.length == 0) {
      this.checkColorName = false;
      this.errorMsgColorName = 'Color name is required.';
    } else if (colorName.length > 30) {
      this.checkColorName = false;
      this.errorMsgColorName = 'Color name must be less than or equal to 30 characters.';
    } else if (this.checkDuplicateColorNameUpdate(colorName)) {
      this.checkColorCode = false;
      this.errorMsgColorName = 'Duplicate Color Name';
    } else {
      this.checkColorName = true;
      this.errorMsgColorName = '';
    }
    if (description.length > 255) {
      this.checkColorDescription = false;
      this.errorMsgDescription = 'Description must be less than or equal to 255 characters.';
    } else {
      this.checkColorDescription = true;
      this.errorMsgDescription = '';
    }

    if (this.checkColorName && this.checkColorDescription) {
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
