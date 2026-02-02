import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, delay } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIService } from '../../../core/services/api.service';
import { BuybackItem } from '../../../shared/interfaces/product.interface';

/**
 * Submission request payload
 */
export interface SubmissionRequest {
  email: string;
  storeId: string;
  items: SubmissionItem[];
  totalValue: number;
  submittedAt: Date;
}

/**
 * Individual item in submission
 */
export interface SubmissionItem {
  productId: string;
  productNumber: string;
  productName: string;
  condition: 'LIKE_NEW' | 'VERY_GOOD' | 'WELL_USED';
  price: number;
  quantity: number;
}

/**
 * Submission response
 */
export interface SubmissionResponse {
  success: boolean;
  submissionId: string;
  confirmationNumber: string;
  message: string;
}

/**
 * Submission Service
 * Handles buyback submission to backend API
 */
@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  // Submission state
  private _isSubmitting = signal<boolean>(false);
  private _lastSubmission = signal<SubmissionResponse | null>(null);

  readonly isSubmitting = this._isSubmitting.asReadonly();
  readonly lastSubmission = this._lastSubmission.asReadonly();

  constructor(
    private http: HttpClient,
    private api: APIService
  ) {}

  /**
   * Submit buyback request
   * NOTE: Currently mocked - no real API call
   */
  submit(request: SubmissionRequest): Observable<SubmissionResponse> {
    this._isSubmitting.set(true);

    // Mock response - replace with real API call when backend is ready
    const mockResponse: SubmissionResponse = {
      success: true,
      submissionId: `SUB-${Date.now()}`,
      confirmationNumber: `BYB-${Math.floor(100000 + Math.random() * 900000)}`,
      message: 'Buyback submission successful'
    };

    // Simulate API delay
    return of(mockResponse).pipe(
      delay(1000), // 1 second delay to simulate network request
      tap(response => {
        this._lastSubmission.set(response);
        this._isSubmitting.set(false);
      }),
      catchError(error => {
        this._isSubmitting.set(false);
        console.error('Submission error:', error);
        return throwError(() => error);
      })
    );

    // Real API call - uncomment when backend is ready
    // return this.http.post<SubmissionResponse>(this.api.submissions, request).pipe(
    //   tap(response => {
    //     this._lastSubmission.set(response);
    //     this._isSubmitting.set(false);
    //   }),
    //   catchError(error => {
    //     this._isSubmitting.set(false);
    //     console.error('Submission error:', error);
    //     return throwError(() => error);
    //   })
    // );
  }

  /**
   * Convert buyback items to submission items
   */
  mapBuybackItemsToSubmission(items: BuybackItem[]): SubmissionItem[] {
    return items.map(item => ({
      productId: item.product.id,
      productNumber: item.product.productNumber,
      productName: item.product.name,
      condition: item.condition,
      price: item.price,
      quantity: item.quantity
    }));
  }

  /**
   * Create submission request from buyback data
   */
  createSubmissionRequest(
    email: string,
    storeId: string,
    items: BuybackItem[],
    totalValue: number
  ): SubmissionRequest {
    return {
      email,
      storeId,
      items: this.mapBuybackItemsToSubmission(items),
      totalValue,
      submittedAt: new Date()
    };
  }

  /**
   * Clear last submission
   */
  clearLastSubmission(): void {
    this._lastSubmission.set(null);
  }
}
