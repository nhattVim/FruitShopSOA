import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../models/product.model';
import { InventoryResponse } from '../../models/inventory.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  isInStock: boolean | null = null;
  inventoryDetails: InventoryResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe(product => {
      this.product = product;
      if (product) {
        this.inventoryService.checkInStock(product.id).subscribe(inStock => {
          this.isInStock = inStock;
        });
        this.inventoryService.getInventoryDetails(product.id).subscribe(details => {
          this.inventoryDetails = details;
        });
      }
    });
  }
}
