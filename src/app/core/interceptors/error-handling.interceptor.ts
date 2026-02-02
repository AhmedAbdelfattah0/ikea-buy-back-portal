import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { toasterCases } from '../../shared/constants/app.constants';

/**
 * Error Handling Interceptor
 *
 * Catches HTTP errors and displays user-friendly messages via toaster.
 * Also logs errors to console for debugging.
 */
export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
        console.error('Client-side error:', error.error);
      } else {
        // Server-side error
        console.error(`Server error ${error.status}:`, error.error);

        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `An error occurred (${error.status})`;
        }
      }

      // Display error message to user
      toaster.openToaster({
        ...toasterCases.ERROR_OCCURRED,
        Message: errorMessage
      });

      // Re-throw error for component-level handling if needed
      return throwError(() => error);
    })
  );
};
