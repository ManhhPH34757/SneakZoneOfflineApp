import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { OrderComponent } from './components/order/order.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductComponent } from './components/product/product.component';
import { BrandComponent } from './components/brand/brand.component';
import { CategoryComponent } from './components/category/category.component';
import { MaterialComponent } from './components/material/material.component';
import { SoleComponent } from './components/sole/sole.component';
import { CustomerComponent } from './components/customer/customer.component';
import { StaffComponent } from './components/staff/staff.component';
import { SizeComponent } from './components/size/size.component';
import { ColorComponent } from './components/color/color.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CouponsComponent } from './components/coupons/coupons.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    OrderComponent,
    UnauthorizedComponent,
    ProductComponent,
    BrandComponent,
    CategoryComponent,
    MaterialComponent,
    SoleComponent,
    CustomerComponent,
    StaffComponent,
    SizeComponent,
    ColorComponent,
    ProductDetailsComponent,
    CouponsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
