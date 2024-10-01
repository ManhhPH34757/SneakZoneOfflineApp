import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  fileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fileForm = this.fb.group({
      files: this.fb.array([this.createFileInput()])
    });
  }

  // Hàm tạo FormControl cho input file
  createFileInput(): FormGroup {
    return this.fb.group({
      file: [null, Validators.required]
    });
  }

  // Lấy FormArray chứa các input file
  get files(): FormArray {
    return this.fileForm.get('files') as FormArray;
  }

  // Thêm input file
  addFileInput(): void {
    if (this.files.length < 5) {
      this.files.push(this.createFileInput());
    }
  }

  // Xóa input file
  removeFileInput(index: number): void {
    if (this.files.length > 1) {
      this.files.removeAt(index);
    }
  }

  // Hàm submit form
  onSubmit(): void {
    if (this.fileForm.valid) {
      // Lặp qua từng control trong FormArray để lấy file đã chọn
      this.files.controls.forEach((fileGroup, index) => {
        const inputElement = document.getElementById('img' + (index + 1)) as HTMLInputElement;

        // Kiểm tra nếu người dùng đã chọn file
        if (inputElement.files && inputElement.files.length > 0) {
          // Lấy tên file
          const fileName = inputElement.files[0].name;
          console.log(`File ${index + 1}: ${fileName}`);
        } else {
          console.log(`File ${index + 1}: No file selected.`);
        }
      });
    }
  }
}
