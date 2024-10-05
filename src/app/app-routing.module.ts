import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { OrderComponent } from './components/order/order.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProductComponent } from './components/product/product.component';
import { MaterialComponent } from './components/material/material.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: {expectedRole: 'ADMIN'} },
  { path: 'products', component: ProductComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderComponent, canActivate: [authGuard] },
  { path: 'materials', component: MaterialComponent, canActivate: [authGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
