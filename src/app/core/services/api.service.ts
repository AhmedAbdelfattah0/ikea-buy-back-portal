import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * API Service
 *
 * Centralized registry of all API endpoints
 * Builds full URLs from base URL and endpoint paths
 */
@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseUrl = environment.apiBaseUrl;
  private endpoints = environment.apiEndpoints;

  /**
   * Get full API URL for an endpoint
   */
  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  // Product endpoints
  public readonly products = this.getUrl(this.endpoints.products);
  public readonly categories = this.getUrl(this.endpoints.categories);
  public readonly productSearch = this.getUrl(this.endpoints.productSearch);

  // Offer endpoints
  public readonly offers = this.getUrl(this.endpoints.offers);
  public readonly offerCalculation = this.getUrl(this.endpoints.offerCalculation);

  // Submission endpoints
  public readonly submissions = this.getUrl(this.endpoints.submissions);

  // Store endpoints
  public readonly stores = this.getUrl(this.endpoints.stores);

  // Config endpoints
  public readonly config = this.getUrl(this.endpoints.config);
}
