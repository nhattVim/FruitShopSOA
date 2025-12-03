import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-success.html',
  styleUrl: './order-success.scss',
})
export class OrderSuccessComponent implements OnInit {
  orderNumber: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.paramMap.get('orderNumber');
  }
}
