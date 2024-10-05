import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../services/staff.service';
import { data } from 'jquery';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'] 
})
export class StaffComponent implements OnInit{
  
  constructor(private fb: FormBuilder,
              private staffService: StaffService
  ) { }

  staffs: any;

  loadStaff() : void {
    this.staffService.geStaff().subscribe((data) => {
      this.staffs = data.result;
      console.log(this.staffs);
    })
  }

  ngOnInit(): void {
    this.loadStaff();
  }

  onSubmit() {
    
  }

}
