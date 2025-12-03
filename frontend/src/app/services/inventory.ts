import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryResponse } from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = '/api/inventory';

  constructor(private http: HttpClient) {}

  checkInStock(productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/inStock/${productId}`);
  }

  getInventoryDetails(productId: number): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(`${this.apiUrl}/${productId}`);
  }
}
