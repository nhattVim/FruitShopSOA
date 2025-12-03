import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      membershipLevel: ['Bronze', Validators.required]
    });
  }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.customerId;

    if (this.isEditMode && this.customerId) {
      this.customerService.getCustomer(this.customerId).subscribe(customer => {
        this.customerForm.patchValue(customer);
      });
    }
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const customerData = this.customerForm.value;

    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer(this.customerId, customerData).subscribe(() => {
        this.router.navigate(['/customers']);
      });
    } else {
      this.customerService.createCustomer(customerData).subscribe(() => {
        this.router.navigate(['/customers']);
      });
    }
  }
}
