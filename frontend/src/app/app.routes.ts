import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductFormComponent } from './components/product-form/product-form';
import { CategoryListComponent } from './components/category-list/category-list';
import { CategoryFormComponent } from './components/category-form/category-form';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CustomerListComponent } from './components/customer-list/customer-list';
import { CustomerFormComponent } from './components/customer-form/customer-form';
import { OrderFormComponent } from './components/order-form/order-form';
import { OrderSuccessComponent } from './components/order-success/order-success';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/:id/edit', component: CategoryFormComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id/edit', component: CustomerFormComponent },
  { path: 'orders/new', component: OrderFormComponent },
  { path: 'orders/success/:orderNumber', component: OrderSuccessComponent }
];
