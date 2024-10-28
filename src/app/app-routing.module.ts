import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { OrderComponent } from './components/order/order.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProductComponent } from './components/product/product.component';
import { BrandComponent } from './components/brand/brand.component';
import { CategoryComponent } from './components/category/category.component';
import { MaterialComponent } from './components/material/material.component';
import { CustomerComponent } from './components/customer/customer.component';
import { StaffComponent } from './components/staff/staff.component';
import { SoleComponent } from './components/sole/sole.component';
import { SizeComponent } from './components/size/size.component';
import { ColorComponent } from './components/color/color.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: {expectedRole: 'ADMIN'} },
  { path: 'products', component: ProductComponent, canActivate: [authGuard] },
  { path: 'products/:idProduct', component: ProductDetailsComponent, canActivate: [authGuard] },
  { path: 'create-orders', component: OrderComponent, canActivate: [authGuard] },
  { path: 'invoices', component: ListOrdersComponent, canActivate: [authGuard], data: {expectedRole: 'ADMIN'} },
  { path: 'brands', component: BrandComponent, canActivate: [authGuard] },
  { path: 'colors', component: ColorComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoryComponent, canActivate: [authGuard] },
  { path: 'materials', component: MaterialComponent, canActivate: [authGuard] },
  { path: 'soles', component: SoleComponent, canActivate: [authGuard] },
  { path: 'sizes', component: SizeComponent, canActivate: [authGuard] },
  { path: 'customers', component:CustomerComponent, canActivate: [authGuard] },
  { path: 'staffs', component: StaffComponent, canActivate: [authGuard], data: {expectedRole: 'ADMIN'} },
  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
