import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CustomerRequest } from '../../class/request/customer-request';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  constructor(private customerService : CustomerService){}

  customers: any;
  customer: CustomerRequest = new CustomerRequest();

  loadCustomer():void{
    this.customerService.getAllCustomers().subscribe(data =>{
      this.customers = data.result;
      console.log(data.result)
    })
  }
  resetForm(){
    this.customer = new CustomerRequest();
  }
  ngOnInit(): void {
      this.loadCustomer();
  }
  
}
