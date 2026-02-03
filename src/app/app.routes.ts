import { Routes } from '@angular/router';
import { Routes as RouteConstants } from './shared/constants/routes.constants';

/**
 * Application Routes
 *
 * Single-page application with one main route.
 *
 * NOTE: Routes do NOT include the /{market}/{lang}/ prefix
 * That's handled automatically by APP_BASE_HREF in app.config.ts
 *
 * URL Examples:
 * - /sa/en/buy-back-quote
 * - /sa/ar/buy-back-quote
 * - /bh/en/buy-back-quote
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: RouteConstants.BUYBACK_QUOTE,
    pathMatch: 'full'
  },
  {
    path: RouteConstants.BUYBACK_QUOTE,
    loadComponent: () =>
      import('./features/buyback-list/pages/buyback-list/buyback-list.component').then(m => m.BuybackListComponent),
    title: 'Buy back estimator tool - IKEA Buyback Portal'
  },
  {
    path: '**',
    redirectTo: RouteConstants.BUYBACK_QUOTE
  }
];
