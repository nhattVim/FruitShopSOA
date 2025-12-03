import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { CustomerService } from '../../services/customer';
import { OrderService } from '../../services/order';
import { Product } from '../../models/product.model';
import { Customer } from '../../models/customer.model';
import { OrderRequest, OrderItemRequest } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss'
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      customerId: [null, Validators.required],
      orderItems: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addProduct(): void {
    this.orderItems.push(this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeProduct(index: number): void {
    this.orderItems.removeAt(index);
  }

  placeOrder(): void {
    if (this.orderForm.invalid) {
      return;
    }

    const orderRequest: OrderRequest = this.orderForm.value;
    this.orderService.placeOrder(orderRequest).subscribe(orderNumber => {
      console.log('Order Placed:', orderNumber);
      this.router.navigate(['/orders/success', orderNumber]); // Redirect to a success page or order details
    });
  }
}
